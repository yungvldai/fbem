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
compose different BEM functions into one. `compose` merges interfaces fields and their types. Take a look below.

#### Example #1
```ts
import { compose } from '@fbem/utils';
// or import compose from '@fbem/utils/dist/compose';

import { cnButton as modDisabled } from './_disabled/button_disabled.css';
import { cnButton as modStyle } from './_style/button_style.css';
import { cnButton as base } from './button.css';

const cnButton = compose(base, modDisabled, modStyle);

cnButton({ style: 'flat', disabled: true }, ['mix']); // 'button button_style_flat button_disabled mix'
```

#### Example #2
```ts
import { compose } from '@fbem/utils';
// or import compose from '@fbem/utils/dist/compose';

import { cnButton as modTypePrimary } from './_type/_primary/button_type_primary.css';
import { cnButton as modTypeSecondary } from './_type/_secondary/button_type_secondary.css';
import { cnButton as base } from './button.css';

const cnButton = compose(base, modTypePrimary, modTypeSecondary);

cnButton({ type: 'primary' }); // 'button button_type_primary'
```