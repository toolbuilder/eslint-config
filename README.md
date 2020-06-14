# Eslint Config

An ESLint [Shareable Config](http://eslint.org/docs/developer-guide/shareable-configs) originally based on the JavaScript [Standard Style](https://standardjs.com) [configuration](https://github.com/standard/eslint-config-standard) from 2019. The [Standard Style](https://standardjs.com) plugin dependencies on, import, node, promises, and standard were removed. No plugins are required by this configuration. The environment is `es2020` to support the BigInt primitive, and get globals such as `Atomic`.

## Use

This package provides a simple script to configure package.json. It updates devDependencies with eslint, and adds eslint configuration to use this package as eslint configuration. It stomps on any existing eslint configuration in package.json, so backup first.

```bash
npm install --save-dev @toolbulder/eslint-config
npx eslint-config
npm install
```
