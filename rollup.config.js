import { basePackfileTestConfig, shellCommand, tempPath } from '@toolbuilder/rollup-plugin-test-tools'
import execa from 'execa' // Note: Cannot go to v6.0.0 because it is a pure ES module and this is CommonJS using esm

const makeConfig = (options) => {
  return {
    input: ['test-pkg/**/*test.js'], // package unit test source file glob
    commands: [
      // The -C parameter ensures that the test does not resolve
      // any packages outside testPackageDir. Ordinarily, it
      // would pickup packages from the package that called Rollup
      // because the execution environments share paths.
      shellCommand(`pnpm -C ${options.testPackageDir} install`),
      // The "unit test" checks to see if the package was properly configured, so configure it now
      async () => execa.command('node_modules/.bin/eslint-config', { cwd: options.testPackageDir, stdio: 'inherit' }),
      shellCommand(`pnpm -C ${options.testPackageDir} test`)
      // TODO     "check:src": "eslint src test"
    ],
    ...options
  }
}

export default [
  {
    testPackageDir: tempPath('eslint-config-CJS'),
    format: 'cjs',
    testPackageJson: {
      type: 'commonjs', // test package with commonJS project
      scripts: {
        test: "tape 'test-pkg/*test.js' | tap-nirvana"
      },
      devDependencies: {
        // dependencies for test script
        tape: '^5.2.2', // used as test runner only
        'tap-nirvana': '^1.1.0'
      }
    }
  },
  {
    testPackageDir: tempPath('eslint-config-ES'),
    format: 'es',
    input: ['test-pkg/**/*test.js'], // unit test source file glob
    testPackageJson: {
      type: 'module', // test package with ES project
      scripts: {
        test: "esm-tape-runner 'test-pkg/**test.js' | tap-nirvana"
      },
      devDependencies: {
        '@small-tech/esm-tape-runner': '^1.0.3',
        'tap-nirvana': '^1.1.0'
      }
    }
  }
].map(options => makeConfig(options)).map(basePackfileTestConfig)
