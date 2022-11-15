import { LoaderContext } from 'webpack';

import { MODULES_REGEXP } from '../constants';
import { Options } from '../types/options';

export const canUseModules = (options: Options, loaderContext: LoaderContext<Options>) => {
  const resourcePath =
    (loaderContext._module && loaderContext._module.matchResource) || loaderContext.resourcePath;

  if (
    (typeof options.auto === 'function' && !options.auto(resourcePath)) ||
    (typeof options.auto === 'boolean' && !(options.auto && MODULES_REGEXP.test(resourcePath))) ||
    (options.auto instanceof RegExp && !options.auto.test(resourcePath))
  ) {
    return false;
  }

  return true;
};
