import { Import } from '../types/misc';
import { Options } from '../types/options';

export const getImportCode = (imports: Import[], options: Options) => {
  let code = '';

  for (const item of imports) {
    const { importName, url, icss, type } = item;

    if (icss) {
      code += `import ${
        options.exportOnlyLocals ? '' : `${importName}, `
      }* as ${importName}_NAMED___ from ${url};\n`;
    } else {
      code +=
        type === 'url'
          ? `var ${importName} = new URL(${url}, import.meta.url);\n`
          : `import ${importName} from ${url};\n`;
    }
  }

  return code || '';
};
