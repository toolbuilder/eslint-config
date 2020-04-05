export const updateTargetConfig = async (targetPkg, configPkg) => {
  const configName = configPkg.name
  const configVersion = `>=${configPkg.version}`
  const eslintVersion = configPkg.devDependencies.eslint

  if (targetPkg.devDependencies == null) {
    targetPkg.devDependencies = {}
  }
  targetPkg.devDependencies.eslint = eslintVersion
  targetPkg.devDependencies[configName] = configVersion
  targetPkg.eslintConfig = { extends: configName }
}
