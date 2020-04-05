import { promises } from 'fs'
import path from 'path'
import resolve from 'resolve'
import { getTargetPackageJson } from './get_target_json.js'
import { updateTargetConfig } from './update_config.js'

/**
 * Read @toolbuilder/eslint-config package.json to acquire version, and
 * eslint version.
 */
const getEslintConfigPackageJson = async () => {
  return new Promise((resolver, rejecter) => {
    resolve('../package.json', { preserveSymlinks: true }, (err, fullPath, pkgJson) => {
      if (err) rejecter(new Error("Could not find eslint-config's package.json file"))
      resolver(pkgJson)
    })
  })
}

const verifyNotModifyingThisPackage = (targetPkgJson, configPkgJson) => {
  if (targetPkgJson.name === configPkgJson.name) {
    throw new Error(`Trying to modify self, ${configPkgJson.name}\n, please run in root of another project`)
  }
}

const createUpdatedPackageJson = (targetPkgJson, configPkgJson) => {
  const targetPkgJsonCopy = { ...targetPkgJson }
  updateTargetConfig(targetPkgJsonCopy, configPkgJson)
  return targetPkgJsonCopy
}

const noUpdates = (targetPkgJsonUpdated, targetPkgJson) => {
  // Using stringify for deep equal, good enough for this purpose, and readily available
  return JSON.stringify(targetPkgJsonUpdated) === JSON.stringify(targetPkgJson)
}

const main = async () => {
  const targetPkgJsonPath = path.join(process.cwd(), 'package.json')

  const configPkgJson = await getEslintConfigPackageJson()
  const targetPkgJson = await getTargetPackageJson(targetPkgJsonPath)

  verifyNotModifyingThisPackage(targetPkgJson, configPkgJson)

  const updatedTargetPkgJson = createUpdatedPackageJson(targetPkgJson, configPkgJson)

  if (noUpdates(updatedTargetPkgJson, targetPkgJson)) {
    console.log('package.json is already configured, no changes made')
  } else {
    await promises.writeFile(targetPkgJsonPath, JSON.stringify(updatedTargetPkgJson, 2, ' '), 'utf-8')
      .catch(error => { throw new Error(`Could not update package.json file, ${error.msg}`) }) // eslint-disable-line
  }
}

main()
