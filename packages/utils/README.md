# @fbem/utils [![npm](https://img.shields.io/npm/v/@fbem/utils)](https://www.npmjs.com/package/@fbem/utils)

**@fbem/utils** is a package which contains useful utils for functional BEM.

## Getting started

```console
npm i @fbem/utils
```

## API

### `compose: (...fns: BemFunction[]) => BemFunction`

#### Description

Use this function when you have multiple style files (e.g. a separate file for each modifier) ​​to 
compose different BEM functions into one.

#### Example
```ts
import { compose } from '@fbem/utils';
// or import compose from '@fbem/utils/compose';

import { cnButton as modDisabled } from './_disabled/button_disabled.css';
import { cnButton as modStyle } from './_style/button_style.css';

const cnButton = compose(modDisabled, modStyle);

cnButton({ style: 'flat', disabled: true }, ['mix-class-name']);
```
