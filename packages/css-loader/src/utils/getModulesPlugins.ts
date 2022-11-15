import { AcceptedPlugin } from 'postcss';
import extractImports from 'postcss-modules-extract-imports';
import localByDefault from 'postcss-modules-local-by-default';
import modulesScope from 'postcss-modules-scope';
import modulesValues from 'postcss-modules-values';
import { LoaderContext } from 'webpack';

import { Options } from '../types/options';
import { escape } from './escape';
import { getLocalIdent } from './getLocalIdent';
import { unescape } from './unescape';

const escapeLocalIdent = (localident: string) =>
  escape(
    localident
      // For `[hash]` placeholder
      .replace(/^((-?[0-9])|--)/, '_$1')
      .replace(/[<>:"/\\|?*]/g, '-')
      .replace(/[\u0000-\u001f\u0080-\u009f]/g, '-')
      .replace(/\./g, '-')
  );

export const getModulesPlugins = (options: Options, loaderContext: LoaderContext<Options>) => {
  const {
    get,
    name,
    context,
    hashSalt,
    hashFunction,
    hashDigest,
    hashDigestLength,
    regExp,
    hashStrategy,
  } = options.localIdent;

  let plugins: AcceptedPlugin[] = [];

  try {
    plugins = [
      modulesValues,
      localByDefault({ mode: 'local' }),
      extractImports(),
      modulesScope({
        generateScopedName(exportName: string) {
          let localIdent: string | undefined;

          if (typeof get !== 'undefined') {
            localIdent = get(loaderContext, name, unescape(exportName));
          }

          // A null/undefined value signals that we should invoke the default
          // getLocalIdent method.
          if (typeof localIdent === 'undefined' || localIdent === null) {
            localIdent = getLocalIdent(loaderContext, name, unescape(exportName), {
              context,
              hashSalt,
              hashFunction,
              hashDigest,
              hashDigestLength,
              hashStrategy,
              regExp,
            });

            return escapeLocalIdent(localIdent).replace(/\[local\]/gi, exportName);
          }

          return escapeLocalIdent(localIdent);
        },
        exportGlobals: options.exportGlobals,
      }),
    ];
  } catch (error) {
    loaderContext.emitError(error as Error);
  }

  return plugins;
};
