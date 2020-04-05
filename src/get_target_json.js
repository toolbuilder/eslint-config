import { promises } from 'fs'

export const getTargetPackageJson = async (pkgJsonPath) => {
  const packageJson = await promises.readFile(pkgJsonPath, 'utf-8')
    .catch(error => { throw new Error(`Could not read ${pkgJsonPath},\n ${error.msg}`) }) // eslint-disable-line
    .then(text => JSON.parse(text))
    .catch(error => { throw new Error(`Could not convert ${pkgJsonPath} to JSON,\n ${error.msg}`) }) // eslint-disable-line
    .catch(error => {
      throw new Error(`Could not find valid package.json at ${pkgJsonPath}, please run from package root\n${error.msg}`)
    })

  return packageJson
}
