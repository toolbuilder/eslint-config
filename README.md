# Eslint Config

An ESLint [Shareable Config](http://eslint.org/docs/developer-guide/shareable-configs) based on the JavaScript Standard Style [configuration](https://github.com/standard/eslint-config-standard). Standard Style plugin dependencies on, import, node, promises, and standard were removed. No plugins are required.

## Use

This package provides a simple script to configure package.json. It updates devDependencies with eslint, and adds eslint configuration to use this package as eslint configuration. It stomps on any existing eslint configuration in package.json, so backup first.

```bash
npm install --save-dev @toolbulder/eslint-config
npx eslint-config
npm install
```
