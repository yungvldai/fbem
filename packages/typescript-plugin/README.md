# @fbem/typescript-plugin [![npm](https://img.shields.io/npm/v/@fbem/typescript-plugin)](https://www.npmjs.com/package/@fbem/typescript-plugin)

**@fbem/typescript-plugin** is a plugin for TypeScript. Plugin provides type definitions for generated BEM functions.

## Getting started

```console
npm i -D @fbem/typescript-plugin
```

**tsconfig.json**
```json
{
  "compilerOptions": {
    "plugins": [
      { 
        "name": "@fbem/typescript-plugin",
        "options": {
          "match": "\\.css",
          "naming": {
            "elem": "__",
            "modName": "_",
            "modVal": "_",
            "prefix": "cn"
          }
        }
      }
    ]
  }
}

```