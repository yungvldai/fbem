import path from 'path';
import { LoaderContext } from 'webpack';

import { ABSOLUTE_SCHEME_REGEXP, NATIVE_WIN32_PATH_REGEXP } from '../constants';
import { Options } from '../types/options';
import { normalizePath } from './normalizePath';

interface SourceMap {
  file?: string;
  sourceRoot?: string;
  sources?: string[];
  sourcesContent?: unknown;
}

const getURLType = (source: string) => {
  if (source[0] === '/') {
    if (source[1] === '/') {
      return 'scheme-relative';
    }

    return 'path-absolute';
  }

  if (NATIVE_WIN32_PATH_REGEXP.test(source)) {
    return 'path-absolute';
  }

  return ABSOLUTE_SCHEME_REGEXP.test(source) ? 'absolute' : 'path-relative';
};

export const normalizeSourceMap = (map: SourceMap | string, resourcePath: string) => {
  let newMap = map;

  // Some loader emit source map as string
  // Strip any JSON XSSI avoidance prefix from the string (as documented in the source maps specification), and then parse the string as JSON.
  if (typeof newMap === 'string') {
    newMap = JSON.parse(newMap) as SourceMap;
  }

  delete newMap.file;

  const { sourceRoot } = newMap;

  delete newMap.sourceRoot;

  if (newMap.sources) {
    // Source maps should use forward slash because it is URLs (https://github.com/mozilla/source-map/issues/91)
    // We should normalize path because previous loaders like `sass-loader` using backslash when generate source map
    newMap.sources = newMap.sources.map((source) => {
      // Non-standard syntax from `postcss`
      if (source.indexOf('<') === 0) {
        return source;
      }

      const sourceType = getURLType(source);

      // Do no touch `scheme-relative` and `absolute` URLs
      if (sourceType === 'path-relative' || sourceType === 'path-absolute') {
        const absoluteSource =
          sourceType === 'path-relative' && sourceRoot
            ? path.resolve(sourceRoot, normalizePath(source))
            : normalizePath(source);

        return path.relative(path.dirname(resourcePath), absoluteSource);
      }

      return source;
    });
  }

  return newMap;
};

export const normalizeSourceMapForRuntime = (map: any, loaderContext: LoaderContext<Options>) => {
  const resultMap: SourceMap = map ? map.toJSON() : null;

  if (resultMap) {
    delete resultMap.file;

    if (
      loaderContext._compilation &&
      loaderContext._compilation.options &&
      loaderContext._compilation.options.devtool &&
      loaderContext._compilation.options.devtool.includes('nosources')
    ) {
      delete resultMap.sourcesContent;
    }

    resultMap.sourceRoot = '';
    resultMap.sources = resultMap.sources!.map((source) => {
      // Non-standard syntax from `postcss`
      if (source.indexOf('<') === 0) {
        return source;
      }

      const sourceType = getURLType(source);

      if (sourceType !== 'path-relative') {
        return source;
      }

      const resourceDirname = path.dirname(loaderContext.resourcePath);
      const absoluteSource = path.resolve(resourceDirname, source);
      const contextifyPath = normalizePath(
        path.relative(loaderContext.rootContext, absoluteSource)
      );

      return `webpack://./${contextifyPath}`;
    });
  }

  return JSON.stringify(resultMap);
};
