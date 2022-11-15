import { icssParser } from './plugins/postcss-icss-parser';
import { importParser } from './plugins/postcss-import-parser';
import { urlParser } from './plugins/postcss-url-parser';
import { JSONSchema7 } from 'json-schema';
import postcss, { AcceptedPlugin, Result } from 'postcss';
import postcssPkg from 'postcss/package.json';
import { satisfies } from 'semver';
import { LoaderContext } from 'webpack';

import { CssSyntaxError } from './classes/CssSyntaxError';
import { Warning } from './classes/Warning';
import { getExportCode } from './codegen/getExportCode';
import { getImportCode } from './codegen/getImportCode';
import { getModuleCode } from './codegen/getModuleCode';
import schema from './options.json';
import { Export, Import, Replacement } from './types/misc';
import { Options, RawOptions } from './types/options';
import { canUseModules } from './utils/canUseModules';
import { getModulesPlugins } from './utils/getModulesPlugins';
import { normalizeOptions } from './utils/normalizeOptions';
import { normalizeSourceMap } from './utils/normalizeSourceMap';
import { stringifyRequest } from './utils/stringifyRequest';

const sort = (a: Import, b: Import) => a.index! - b.index!;

const getFilter =
  (filter: Function | undefined, resourcePath: string) =>
  (...args: unknown[]) => {
    if (typeof filter === 'function') {
      return filter(...args, resourcePath);
    }

    return true;
  };

const shouldUseImportPlugin = (options: Options) => {
  if (options.exportOnlyLocals) {
    return false;
  }

  if (typeof options.import === 'boolean') {
    return options.import;
  }

  return true;
};

const shouldUseURLPlugin = (options: Options) => {
  if (options.exportOnlyLocals) {
    return false;
  }

  if (typeof options.url === 'boolean') {
    return options.url;
  }

  return true;
};

const combineRequests = (preRequest: string, url: string) => {
  const idx = url.indexOf('!=!');

  return idx !== -1 ? url.slice(0, idx + 3) + preRequest + url.slice(idx + 3) : preRequest + url;
};

const getPreRequester = ({ loaders, loaderIndex }: LoaderContext<Options>) => {
  const cache = Object.create(null);

  // @ts-ignore
  return (number) => {
    if (cache[number]) {
      return cache[number];
    }

    if (number === false) {
      cache[number] = '';
    } else {
      const loadersRequest = loaders
        .slice(loaderIndex, loaderIndex + 1 + (typeof number !== 'number' ? 0 : number))
        .map((x) => x.request)
        .join('!');

      cache[number] = `-!${loadersRequest}!`;
    }

    return cache[number];
  };
};

export default async function loader(
  this: LoaderContext<Options>,
  content: string | Buffer,
  map: Object,
  meta: any
) {
  const rawOptions = this.getOptions(schema as JSONSchema7);
  const plugins: AcceptedPlugin[] = [];
  const callback = this.async();

  let options: Options;

  try {
    options = normalizeOptions(rawOptions as RawOptions, this);
  } catch (error) {
    callback(error as Error);

    return;
  }

  const replacements: Replacement[] = [];
  const exports: Export[] = [];

  if (canUseModules(options, this)) {
    plugins.push(...getModulesPlugins(options, this));
  }

  const importPluginImports: Import[] = [];
  const importPluginApi: Import[] = [];

  let isSupportAbsoluteURL = false;

  // TODO enable by default in the next major release
  if (
    this._compilation &&
    this._compilation.options &&
    this._compilation.options.experiments &&
    this._compilation.options.experiments.buildHttp
  ) {
    isSupportAbsoluteURL = true;
  }

  if (shouldUseImportPlugin(options)) {
    plugins.push(
      importParser({
        isSupportAbsoluteURL: false,
        isSupportDataURL: false,
        isCSSStyleSheet: false,
        loaderContext: this,
        imports: importPluginImports,
        api: importPluginApi,
        filter: typeof options.import === 'boolean' ? undefined : options.import.filter,
        urlHandler: (url: string) =>
          stringifyRequest(
            this,
            combineRequests(getPreRequester(this)(options.importLoaders), url)
          ),
      })
    );
  }

  const urlPluginImports: Import[] = [];

  if (shouldUseURLPlugin(options)) {
    plugins.push(
      urlParser({
        isSupportAbsoluteURL,
        isSupportDataURL: true,
        imports: urlPluginImports,
        replacements,
        context: this.context,
        rootContext: this.rootContext,
        filter: getFilter(
          typeof options.url === 'boolean' ? undefined : options.url.filter,
          this.resourcePath
        ),
        urlHandler: (url: string) => stringifyRequest(this, url),
        // Support data urls as input in new URL added in webpack@5.38.0
      })
    );
  }

  const needToUseIcssPlugin = canUseModules(options, this);

  if (needToUseIcssPlugin) {
    plugins.push(
      icssParser({
        loaderContext: this,
        exports,
      })
    );
  }

  // Reuse CSS AST (PostCSS AST e.g 'postcss-loader') to avoid reparsing
  if (meta) {
    const { ast } = meta;

    if (ast && ast.type === 'postcss' && satisfies(ast.version, `^${postcssPkg.version}`)) {
      content = ast.root;
    }
  }

  const { resourcePath } = this;

  let result: Result;

  try {
    result = await postcss(plugins).process(content, {
      from: resourcePath,
      to: resourcePath,
      map: options.sourceMap
        ? {
            prev: map ? normalizeSourceMap(map, resourcePath) : undefined,
            inline: false,
            annotation: false,
          }
        : false,
    });
  } catch (error: any) {
    if (error.file) {
      this.addDependency(error.file);
    }

    callback(error.name === 'CssSyntaxError' ? new CssSyntaxError(error) : error);

    return;
  }

  for (const warning of result.warnings()) {
    this.emitWarning(new Warning(warning));
  }

  const imports = [...importPluginImports.sort(sort), ...urlPluginImports.sort(sort)];

  const api = [...importPluginApi.sort(sort)];

  if (options.exportOnlyLocals !== true) {
    imports.unshift({
      type: 'api_import',
      importName: '___CSS_LOADER_API_IMPORT___',
      url: stringifyRequest(this, require.resolve('./runtime/api')),
    });

    if (options.sourceMap) {
      imports.unshift({
        importName: '___CSS_LOADER_API_SOURCEMAP_IMPORT___',
        url: stringifyRequest(this, require.resolve('./runtime/sourceMaps')),
      });
    } else {
      imports.unshift({
        importName: '___CSS_LOADER_API_NO_SOURCEMAP_IMPORT___',
        url: stringifyRequest(this, require.resolve('./runtime/noSourceMaps')),
      });
    }
  }

  const importCode = getImportCode(imports, options);

  let moduleCode: string;

  try {
    moduleCode = getModuleCode(result, api, replacements, options, this);
  } catch (error) {
    callback(error as Error);

    return;
  }

  const exportCode = getExportCode(exports, replacements, needToUseIcssPlugin, options);

  callback(null, `${importCode}${moduleCode}${exportCode}`);
}
