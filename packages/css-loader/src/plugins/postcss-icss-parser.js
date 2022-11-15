import { extractICSS, replaceValueSymbols } from 'icss-utils';

import { Warning } from '../classes/Warning';

const icssParser = (options = {}) => {
  return {
    postcssPlugin: 'postcss-icss-parser',
    async OnceExit(root) {
      const importReplacements = Object.create(null);
      const { icssImports, icssExports } = extractICSS(root);

      if (Object.keys(icssImports).length > 0) {
        // Hard to predict the name of the import,
        // so decided not to use
        options.loaderContext.emitWarning(
          new Warning({ text: 'ICSS imports are not supported and are ignored' })
        );
      }

      for (const name of Object.keys(icssExports)) {
        const value = replaceValueSymbols(icssExports[name], importReplacements);

        options.exports.push({ name, value });
      }
    },
  };
};

icssParser.postcss = true;

export { icssParser };
