# @fbem/css-loader [![npm](https://img.shields.io/npm/v/@fbem/css-loader)](https://www.npmjs.com/package/@fbem/css-loader)

## Getting started

**@fbem/css-loader** is a loader for webpack, which allows you to load CSS and compile it to BEM functions. **@fbem/css-loader** is a fork of [`css-loader`](https://github.com/webpack-contrib/css-loader).

> **Warning**
>
> 1. webpack@5 is required
> 2. mini-css-extract-plugin@2.7.0+ is required

```console
npm i -D @fbem/css-loader
```

**webpack.config.js**

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "@fbem/css-loader"],
      },
    ],
  },
};
```

## Options

### `url`

#### Type

```ts
type UrlOption = boolean | { filter: (url: string, resourcePath: string) => boolean; }
```

#### Description

Default: `true`

Allow to enable/disable handling the CSS functions `url` and `image-set`.
A function can also be passed to control this behavior dynamically based on the path to the asset.

### `import`

#### Type

```ts
type ImportOption = boolean | { filter: (url: string, media: string, resourcePath: string) => boolean }
```

#### Description

Default: `true`

Allows to enable/disable `@import` at-rules handling.
A function can also be passed to control this behavior dynamically based on the path to the asset.

### `naming`

#### Type

```ts
type NamingOption = { 
  elem?: string,
  modName?: string,
  modVal?: string,
  prefix?: string
}
```

#### Description

Default: `{ elem: '__', modName: '_', modVal: '_', prefix: 'cn' }`

Allows to specify separators for parsing classnames according to the rules of the BEM methodology, 
also allows to specify a prefix for exported BEM functions.

### `exportGlobals`

#### Type

```ts
type ExportGlobalsOption = boolean
```

#### Description

Default: `false`

Allow `@fbem/css-loader` to export names from global class or id, so you can use that as local name.

### `exportOnlyLocals`

#### Type

```ts
type ExportOnlyLocalsOption = boolean
```

#### Description

Default: `false`

Useful when you use for pre-rendering (for example SSR).
`@fbem/css-loader` doesn't embed CSS but only exports the identifier mappings.

### `sourceMap`

#### Type

```ts
type SourceMapOption = boolean
```

#### Description

Default: depends on the `compiler.devtool` value

By default generation of source maps depends on the [`devtool`](https://webpack.js.org/configuration/devtool/) option. All values enable source map generation except `eval` and `false` value.

### `importLoaders`

#### Type

```ts
type ImportLoadersOption = number
```

#### Description

Default: `0`

Allows to enable/disable or specify number of loaders applied before CSS loader for `@import` at-rules, CSS modules and ICSS imports, i.e. `@import`/`composes`/`@value value from './values.css'`/etc.


### `auto`

#### Type

```ts
type AutoOption = boolean | RegExp | ((path: string) => boolean);
```

#### Description

Default: `undefined`

Allows auto enable CSS modules/ICSS (imports & exports from CSS) based on filename.

### `localIdent`

#### Type

```ts
type LocalIdentOption = {
  name?: string,
  context?: string,
  hashSalt?: string,
  hashDigest?: string,
  hashDigestLength?: number,
  hashFunction?: any;
  hashStrategy?: 'resource-path-and-local-name' | 'minimal-subset';
  regExp?: string | RegExp;
  get?: (context: LoaderContext<Options>, localIdentName: string, localName: string) => string;
}
```

#### Description

Default: 
```ts
const localIdent = {
  name: '[hash:base64]',
  context: loaderContext.rootContext,
  hashSalt: loaderContext._compilation.hashSalt,
  hashFunction: loaderContext._compilation.hashFunction,
  hashDigest: loaderContext._compilation.hashDigest,
  hashDigestLength: loaderContext._compilation.hashDigestLength
}
`

Allows to configure the generated local ident name.