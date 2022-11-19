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
boolean | { filter: (url: string, resourcePath: string) => boolean; }
```

#### Description

Default: `true`

Allow to enable/disable handling the CSS functions `url` and `image-set`.
A function can also be passed to control this behavior dynamically based on the path to the asset.

### `import`

#### Type

```ts
boolean | { filter: (url: string, media: string, resourcePath: string) => boolean };
```

#### Description

Default: `true`

Allows to enable/disable `@import` at-rules handling.
A function can also be passed to control this behavior dynamically based on the path to the asset.

### `naming`

#### Type

```ts
{ 
  elem?: string,
  modName?: string,
  modVal?: string,
  prefix?: string
}
```

#### Description

Default: `{ elem: '__', modName: '\_', modVal: '\_', prefix: 'cn' }`

Allows to specify separators for parsing classnames according to the rules of the BEM methodology, 
also allows to specify a prefix for exported BEM functions.

### `exportGlobals`

#### Type

```ts
boolean
```

#### Description

Default: `false`

Allow `@fbem/css-loader` to export names from global class or id, so you can use that as local name.

### `exportOnlyLocals`

#### Type

```ts
boolean
```

#### Description

Default: `false`

Useful when you use for pre-rendering (for example SSR).
`@fbem/css-loader` doesn't embed CSS but only exports the identifier mappings.

### `sourceMap`

#### Type

```ts
boolean
```

#### Description

Default: depends on the `compiler.devtool` value

By default generation of source maps depends on the [`devtool`](https://webpack.js.org/configuration/devtool/) option. All values enable source map generation except `eval` and `false` value.

### `importLoaders`

#### Type

```ts
number
```

#### Description

Default: `0`

Allows to enable/disable or specify number of loaders applied before CSS loader for `@import` at-rules, CSS modules and ICSS imports, i.e. `@import`/`composes`/`@value value from './values.css'`/etc.


.. coming soon ..

