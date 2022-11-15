import { createBemStructure } from '@fbem/core';

import { NO_MOD_VAL } from '../constants';
import { Export, Replacement } from '../types/misc';
import { Options } from '../types/options';

export const getExportCode = (
  exports: Export[],
  replacements: Replacement[],
  icssPluginUsed: boolean,
  options: Options
) => {
  let code = '';

  if (icssPluginUsed) {
    const classesMap = exports.reduce((acc, { name, value }) => ({ ...acc, [name]: value }), {});
    const bemStructure = createBemStructure(classesMap, options.naming);

    let localsCode = Object.entries(bemStructure)
      .map(([bemFnName, bemParams]) => {
        const modNames = Object.keys(bemParams.mods);
        const modsArg = `{${modNames.join(',')}}={},`;
        const hasMods = modNames.length > 0;

        const bemBody = `var r=["${bemParams.base}"].concat(m);${Object.keys(bemParams.mods)
          .map((modName) =>
            Object.keys(bemParams.mods[modName])
              .map(
                (modVal) =>
                  `if(${
                    modName === NO_MOD_VAL ? modName : `\`\$\{${modName}\}\`==="${modVal}"`
                  })r.push("${bemParams.mods[modName][modVal]}");`
              )
              .join('')
          )
          .join('')}return r.join(" ");`;

        return `export var ${bemFnName}=(${hasMods ? modsArg : ''}m=[])=>{${bemBody}}\n`;
      })
      .join('');

    for (const { replacementName } of replacements) {
      localsCode = localsCode.replace(
        new RegExp(replacementName, 'g'),
        () => `" + ${replacementName} + "`
      );
    }

    if (options.exportOnlyLocals) {
      return `${code}${localsCode}`;
    }

    code += localsCode;
  }

  return `\n${code}export default ___CSS_LOADER_EXPORT___;\n`;
};
