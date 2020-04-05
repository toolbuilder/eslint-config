import { promises } from 'fs'
import { test } from 'zora'
import path from 'path'
import os from 'os'
import { getTargetPackageJson } from '../src/get_target_json.js'

const testThrows = async (assert, msg, test) => {
  let caughtException = false
  try {
    await test()
  } catch (error) {
    caughtException = true
  }
  assert.ok(caughtException, msg)
}

async function makeTempDir (prefix) {
  return promises.mkdtemp(path.join(os.tmpdir(), prefix))
}

test('No package.json throws ', async assert => {
  const tempDir = await makeTempDir('NotJson')
  await testThrows(assert, 'getPackageJson throws when no package available', async () => {
    await getTargetPackageJson(path.join(tempDir, 'package.json'))
  })
})

test('Package not JSON throws', async assert => {
  const tempDir = await makeTempDir('NotJson')
  const packageJson = path.join(tempDir, 'package.json')
  await promises.writeFile(packageJson, 'This is NOT JSON\n', 'utf-8')
  await testThrows(assert, 'getPackageJson throws when package is not JSON', async () => {
    await getTargetPackageJson(path.join(tempDir, 'package.json'))
  })
})

test('Reads package.json correctly', async assert => {
  const expected = {
    name: '@toolbuilder/eslint-config',
    version: '0.1.0',
    description: 'Eslint config based',
    main: 'index.js'
  }
  const tempDir = await makeTempDir('CorrectJson')
  const packageJson = path.join(tempDir, 'package.json')
  await promises.writeFile(packageJson, JSON.stringify(expected), 'utf-8')
  const actual = await getTargetPackageJson(packageJson)
  assert.deepEqual(actual, expected, 'getPackageJson reads package.json correctly')
})
