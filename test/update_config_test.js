import { updateTargetConfig } from '../src/update_config.js'
import { test } from 'zora'

// Define test parameters
const testTargets = [
  ['adds undefined devDependencies', {}],
  ['adds missing devDependencies', { devDependencies: {} }],
  ['updates existing devDependencies', { devDependencies: { eslint: '^5.2.0', '@toolbuilder/eslint-config': '0.0.1' } }],
  ['updates eslint devDependencies', { devDependencies: { eslint: '^5.2.0', '@toolbuilder/eslint-config': '0.1.1' } }],
  ['destroys existing config', { eslintConfig: { extends: 'someotherconfig', ignore: 'filesthatshouldbescanned' } }]
]

const configPkg = {
  name: '@toolbuilder/eslint-config',
  version: '0.1.1',
  devDependencies: {
    eslint: '^6.8.0',
    '@toolbuilder/eslint-config': '>=0.0.1',
    zora: '^3.1.8'
  }
}

const expectedPkg = {
  name: 'mypackage',
  version: '2.1.3',
  devDependencies: {
    eslint: '^6.8.0',
    '@toolbuilder/eslint-config': '>=0.1.1'
  },
  eslintConfig: {
    extends: '@toolbuilder/eslint-config'
  }
}

// Create tests using test parameters
testTargets.forEach(([description, targetPkgBase]) => {
  const targetPackage = {
    name: 'mypackage',
    version: '2.1.3',
    ...targetPkgBase
  }

  test(`addDependencies: ${description}`, assert => {
    const configPkgCopy = { ...configPkg } // don't want to modify expected object accidently
    updateTargetConfig(targetPackage, configPkgCopy)
    assert.deepEqual(targetPackage, expectedPkg, 'target matches expected')
  })
})
