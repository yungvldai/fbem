import { ComposeFunction } from './types';

const compose: ComposeFunction = (...fns: any[]) => {
  return (modifies: any = {}, mixes: string[] = []) => {
    return Array.from(
      new Set([...fns.reduce((acc, fn) => fn(modifies).split(' ').concat(acc), []), ...mixes])
    ).join(' ');
  };
};

export default compose;
