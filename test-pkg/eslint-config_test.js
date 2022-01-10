import fs from 'fs-extra'
import { test } from 'zora'

test('verify package.json configured', async assert => {
  const packageJson = await fs.readJSON('package.json')
  const config = packageJson.eslintConfig
  assert.ok(config, 'has eslint configuration in package.json')
  assert.deepEqual(Object.keys(config), ['extends'], 'configuration only has extends property')
  assert.deepEqual(packageJson.eslintConfig.extends, '@toolbuilder/eslint-config', 'extends property value correct')
})
