import { NamingOptions } from './types';

export const parseBem = (className: string, naming: NamingOptions) => {
  let acc = '';
  const result = { block: '', elem: '', modName: '', modVal: '' };
  let target: keyof typeof result = 'block';

  while (className) {
    if (className.startsWith(naming.elem) && target === 'block') {
      result[target] = acc;
      target = 'elem';
      acc = '';
      className = className.substring(naming.elem.length);
      continue;
    }

    if (className.startsWith(naming.modName) && (target === 'block' || target === 'elem')) {
      result[target] = acc;
      target = 'modName';
      acc = '';
      className = className.substring(naming.modName.length);
      continue;
    }

    if (className.startsWith(naming.modVal) && target === 'modName') {
      result[target] = acc;
      target = 'modVal';
      acc = '';
      className = className.substring(naming.modVal.length);
      continue;
    }

    acc += className.charAt(0);
    className = className.substring(1);
  }

  result[target] = acc;

  return result;
};
