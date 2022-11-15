# @fbem/css-loader

## Getting started

**@fbem/css-loader** is a loader for webpack, which allows you to load CSS and compile it to BEM functions.

> **Warning**
>
> 1. webpack@5 is required
> 2. mini-css-extract-plugin is required

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