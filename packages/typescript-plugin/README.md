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
      }
    ]
  }
}
```

## Options

| Option | Description     |                   Default value                         |
|:------------:|:------:|:---------------------------------------------------------------:|
|     match    | Match pattern of what files should plugin process       |                              `"\\.css"`                             |
|    naming    | BEM naming rules for parsing CSS       | `{ "elem": "__", "modName": "\_", "modVal": "\_", "prefix": "cn" }` |
|   postcssOptions | Allows loading plugins (only supported ones) from PostCSS configuration and disable some of them    | `{ "useConfig": false, "excludePlugins": [] }`

useConfig	false	Set to true to load plugins from your PostCSS config.
excludePlugins	false	Only sync plugins are supported. Use this to set an array of async plugins to exclude (i.e. ['postcss-mixins'])

For VS Code users it's important to use [workspace version of TypeScript](https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-the-workspace-version-of-typescript).

And last but not least: add a declaration (.d.ts) file with the following content into your project:
```ts
declare module '*.css';
```

## Troubleshooting

The first thing to do in case of problems is to make sure that the root of the project in the IDE is the folder with `tsconfig` file. Make sure you are using the workspace version of TypeScript. Try to restart TS server. If the problem persists, then open an issue, but please attach the TS server logs.
