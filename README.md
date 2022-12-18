# Functional BEM

FBEM is a functional implementation of the [BEM methodology](https://en.bem.info/methodology/quick-start/). 
FBEM packages help you clean up your styles and make them clearer and more organized.

## Demo
<img src="https://github.com/yungvldai/fbem/blob/master/media/demo.gif" alt="demo" width="100%">


## Packages

**There is a rule that packages with the same major version must be compatible**

|       Package name      |                                                      Package version                                                      |
|:-----------------------:|:-------------------------------------------------------------------------------------------------------------------------:|
|        [@fbem/core](https://github.com/yungvldai/fbem/tree/master/packages/core)       |              [ ![npm](https://img.shields.io/npm/v/@fbem/core) ]( https://www.npmjs.com/package/@fbem/core )              |
|     [@fbem/css-loader](https://github.com/yungvldai/fbem/tree/master/packages/css-loader)    |        [ ![npm](https://img.shields.io/npm/v/@fbem/css-loader) ]( https://www.npmjs.com/package/@fbem/css-loader )        |
| [@fbem/typescript-plugin](https://github.com/yungvldai/fbem/tree/master/packages/typescript-plugin) | [ ![npm](https://img.shields.io/npm/v/@fbem/typescript-plugin) ]( https://www.npmjs.com/package/@fbem/typescript-plugin ) |
|       [@fbem/utils](https://github.com/yungvldai/fbem/tree/master/packages/utils)       |             [ ![npm](https://img.shields.io/npm/v/@fbem/utils) ]( https://www.npmjs.com/package/@fbem/utils )             |


## Code example

```css
/* style.css */

.block {
  position: relative;
}

.block__elem {
  color: purple;
}

.block__elem_mod_val-a {
  backgound: white;
}

.block__elem_mod_val-b {
  backgound: black;
}

.block__name-with-dashes {
  display: none;
}

.block__name-with-dashes_visible {
  display: block;
}
```
```js
/* index.js */

import { cnBlock, cnBlockElem, cnBlockNameWithDashes } from './style.css';

cnBlock(); // 'block'
cnBlockElem({ mod: 'val-a' }); // 'block__elem block__elem_mod_val-a'
cnBlock({}, ['mix']); // 'block mix'
cnBlockElem({ mod: 'val-b' }, ['mix1', 'mix2']); // 'block__elem block__elem_mod_val-b mix1 mix2'
cnBlockNameWithDashes({ visible: true }); // 'block__name-with-dashes block__name-with-dashes_visible'
```
