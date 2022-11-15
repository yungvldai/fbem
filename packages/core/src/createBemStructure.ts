import { applyCase } from './applyCase';
import { NO_MOD_VAL } from './constants';
import { parseBem } from './parseBem';
import { BemParams, NamingOptions } from './types';

export const createBemStructure = (classesMap: Record<string, string>, naming: NamingOptions) => {
  const bemStructure: Record<string, BemParams> = {};

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
      bemStructure[bemFnName].mods[normalizedModName] = {};
    }

    bemStructure[bemFnName].mods[normalizedModName][modVal || NO_MOD_VAL] = value;
  }

  return bemStructure;
};
