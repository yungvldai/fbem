import { Result } from 'postcss';
import { LoaderContext } from 'webpack';

import { Import, Replacement } from '../types/misc';
import { Options } from '../types/options';
import { normalizeSourceMapForRuntime } from '../utils/normalizeSourceMap';

const printParams = (media?: string, dedupe?: string, supports?: string, layer?: string) => {
  let result = '';

  if (typeof layer !== 'undefined') {
    result = `, ${JSON.stringify(layer)}`;
  }

  if (typeof supports !== 'undefined') {
    result = `, ${JSON.stringify(supports)}${result}`;
  } else if (result.length > 0) {
    result = `, undefined${result}`;
  }

  if (dedupe) {
    result = `, true${result}`;
  } else if (result.length > 0) {
    result = `, false${result}`;
  }

  if (media) {
    result = `${JSON.stringify(media)}${result}`;
  } else if (result.length > 0) {
    result = `""${result}`;
  }

  return result;
};

export const getModuleCode = (
  result: Result,
  api: Import[],
  replacements: Replacement[],
  options: Options,
  loaderContext: LoaderContext<Options>
) => {
  if (options.exportOnlyLocals === true) {
    return '';
  }

  let sourceMapValue = '';

  if (options.sourceMap) {
    const sourceMap = result.map;

    sourceMapValue = `,${normalizeSourceMapForRuntime(sourceMap, loaderContext)}`;
  }

  let code = JSON.stringify(result.css);

  let beforeCode = `var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(${
    options.sourceMap
      ? '___CSS_LOADER_API_SOURCEMAP_IMPORT___'
      : '___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___'
  });\n`;

  for (const item of api) {
    const { url, layer, supports, media, dedupe } = item;

    if (url) {
      const printedParam = printParams(media, undefined, supports, layer);

      beforeCode += `___CSS_LOADER_EXPORT___.push([module.id, ${JSON.stringify(
        `@import url(${url});`
      )}${printedParam.length > 0 ? `, ${printedParam}` : ''}]);\n`;
    } else {
      const printedParam = printParams(media, dedupe, supports, layer);

      beforeCode += `___CSS_LOADER_EXPORT___.i(${item.importName}${
        printedParam.length > 0 ? `, ${printedParam}` : ''
      });\n`;
    }
  }

  for (const { replacementName, importName, hash, needQuotes } of replacements) {
    const getUrlOptions = ([] as string[])
      .concat(hash ? [`hash: ${JSON.stringify(hash)}`] : [])
      .concat(needQuotes ? 'needQuotes: true' : []);
    const preparedOptions = getUrlOptions.length > 0 ? `, { ${getUrlOptions.join(', ')} }` : '';

    beforeCode += `var ${replacementName} = ___CSS_LOADER_GET_URL_IMPORT___(${importName}${preparedOptions});\n`;
    code = code.replace(new RegExp(replacementName, 'g'), () => `" + ${replacementName} + "`);
  }

  // Indexes description:
  // 0 - module id
  // 1 - CSS code
  // 2 - media
  // 3 - source map
  // 4 - supports
  // 5 - layer
  return `${beforeCode}\n___CSS_LOADER_EXPORT___.push([module.id, ${code}, ""${sourceMapValue}]);\n`;
};
