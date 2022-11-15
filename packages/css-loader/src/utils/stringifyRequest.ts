import path from 'path';
import { LoaderContext } from 'webpack';

import { RELATIVE_PATH_REGEXP } from '../constants';
import { Options } from '../types/options';

const isAbsolutePath = (str: string) => path.posix.isAbsolute(str) || path.win32.isAbsolute(str);

export const stringifyRequest = (loaderContext: LoaderContext<Options>, request: string) => {
  if (
    typeof loaderContext.utils !== 'undefined' &&
    typeof loaderContext.utils.contextify === 'function'
  ) {
    return JSON.stringify(
      loaderContext.utils.contextify(loaderContext.context || loaderContext.rootContext, request)
    );
  }

  const splitted = request.split('!');
  const { context } = loaderContext;

  return JSON.stringify(
    splitted
      .map((part) => {
        // First, separate singlePath from query, because the query might contain paths again
        const splittedPart = part.match(/^(.*?)(\?.*)/);
        const query = splittedPart ? splittedPart[2] : '';
        let singlePath = splittedPart ? splittedPart[1] : part;

        if (isAbsolutePath(singlePath) && context) {
          singlePath = path.relative(context, singlePath);

          if (isAbsolutePath(singlePath)) {
            // If singlePath still matches an absolute path, singlePath was on a different drive than context.
            // In this case, we leave the path platform-specific without replacing any separators.
            // @see https://github.com/webpack/loader-utils/pull/14
            return singlePath + query;
          }

          if (RELATIVE_PATH_REGEXP.test(singlePath) === false) {
            // Ensure that the relative path starts at least with ./ otherwise it would be a request into the modules directory (like node_modules).
            singlePath = `./${singlePath}`;
          }
        }

        return singlePath.replace(/\\/g, '/') + query;
      })
      .join('!')
  );
};
