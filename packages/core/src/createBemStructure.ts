import { applyCase } from './applyCase';
import { parseBem } from './parseBem';
import { BemStructure, NamingOptions, StringMod } from './types';

export const createBemStructure = (classesMap: Record<string, string>, naming: NamingOptions) => {
  const bemStructure: BemStructure = {};

  for (const [name, value] of Object.entries(classesMap)) {
    const { block, elem, modName, modVal } = parseBem(name, naming);

    const bemFnPrefix = applyCase(naming.prefix);

    const bemFnName =
      bemFnPrefix + applyCase(block, bemFnPrefix ? 'pascal' : 'camel') + applyCase(elem, 'pascal');

    if (!bemStructure[bemFnName]) {
      bemStructure[bemFnName] = {
        base: value,
        mods: {},
      };
    }

    if (!modName) {
      continue;
    }

    const normalizedModName = applyCase(modName);

    if (!bemStructure[bemFnName].mods[normalizedModName]) {
      bemStructure[bemFnName].mods[normalizedModName] = {
        type: 'boolean',
        value,
      };
    }

    if (modVal) {
      bemStructure[bemFnName].mods[normalizedModName] = {
        type: 'string',
        values: {
          ...((bemStructure[bemFnName].mods[normalizedModName] as StringMod).values || {}),
          [modVal]: value,
        },
      };
    }
  }

  return bemStructure;
};
