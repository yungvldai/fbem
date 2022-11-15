import { createBemStructure, DEFAULT_NAMING_OPTIONS } from '@fbem/core';

import { Options } from '../types/options';
import { CSSExportsWithSourceMap } from './getCssExports';

export const createDtsExports = ({
  cssExports,
  options,
}: {
  cssExports: CSSExportsWithSourceMap;
  options: Options;
}): string => {
  const bemStructure = createBemStructure(cssExports.classes, {
    ...DEFAULT_NAMING_OPTIONS,
    ...(options.naming || {}),
  });

  return Object.entries(bemStructure)
    .map(([bemFnName, bemParams]) => {
      const modNames = Object.keys(bemParams.mods);
      const modsArg = `modifiers?: { ${modNames
        .map((modName) => {
          const mod = bemParams.mods[modName];

          if (mod.type === 'boolean') {
            return `${modName}?: boolean`;
          }

          return `${modName}?: ${Object.keys(mod.values)
            .map((modVal) => `'${modVal}'`)
            .join('|')}`;
        })
        .join(', ')} } = {}, `;
      const hasMods = modNames.length > 0;

      return `export const ${bemFnName}: (${hasMods ? modsArg : ''}mixes?: string[]) => string;`;
    })
    .join('\n');
};
