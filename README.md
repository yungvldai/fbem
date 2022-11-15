# Functional BEM

## Demo
![demo](https://github.com/yungvldai/fbem/blob/master/media/demo.gif)


## Example

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
cnBlock(['mix']); // 'block mix'
cnBlockElem({ mod: 'val-b' }, ['mix1', 'mix2']); // 'block__elem block__elem_mod_val-b mix1 mix2'
cnBlockNameWithDashes({ visible: true }); // 'block__name-with-dashes block__name-with-dashes_visible'
```