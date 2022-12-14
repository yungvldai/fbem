import { Options } from '../types/options';
import { CSSExportsWithSourceMap } from './getCssExports';
import { createBemStructure, DEFAULT_NAMING_OPTIONS } from '@fbem/core';

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
            .map((modVal) => {
              let type = `'${modVal}'`;

              if (['true', 'false'].includes(modVal) || !Number.isNaN(Number(modVal))) {
                type += ` | ${modVal}`;
              }

              return type;
            })
            .join(' | ')}`;
        })
        .join(', ')} } = {}`;

      return `export const ${bemFnName}: (${modsArg}, mixes?: (string | undefined)[]) => string;`;
    })
    .join('\n');
};
