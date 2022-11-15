import { createBemStructure } from '@fbem/core';

import { Options } from '../options';
import { CSSExportsWithSourceMap } from './getCssExports';
import { Logger } from './logger';

export const createDtsExports = ({
  cssExports,
  fileName,
  logger,
  options,
}: {
  cssExports: CSSExportsWithSourceMap;
  fileName: string;
  logger: Logger;
  options: Options;
}): string => {
  const bemStructure = createBemStructure(cssExports.classes, options.naming);

  return Object.entries(bemStructure)
    .map(([bemFnName, bemParams]) => {
      const modNames = Object.keys(bemParams.mods);
      const modsArg = `modifiers: { ${modNames
        .map((modName) => `${modName}?: unknown`)
        .join(', ')} } = {}, `;
      const hasMods = modNames.length > 0;

      return `export const ${bemFnName}: (${
        hasMods ? modsArg : ''
      }mixes: string[] = []) => string;`;
    })
    .join('\n');
};
