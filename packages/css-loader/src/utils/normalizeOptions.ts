import { LoaderContext } from 'webpack';

import { LocalIdentOptions, Options, RawLocalIdentOptions, RawOptions } from '../types/options';

const getLocalIdentOptions = (
  localIdentOptions: RawLocalIdentOptions | undefined,
  loaderContext: LoaderContext<Options>
): LocalIdentOptions => {
  const { outputOptions } = loaderContext._compilation!;

  return {
    name: '[hash:base64]',
    context: loaderContext.rootContext,
    hashSalt: outputOptions.hashSalt,
    hashFunction: outputOptions.hashFunction,
    hashDigest: outputOptions.hashDigest,
    hashDigestLength: outputOptions.hashDigestLength,
    ...(localIdentOptions || {}),
  };
};

export const normalizeOptions = (
  rawOptions: RawOptions,
  loaderContext: LoaderContext<Options>
): Options => {
  const { naming, localIdent, ...restRawOptions } = rawOptions;

  return {
    url: true,
    import: true,
    naming: naming || {
      elem: '__',
      modName: '_',
      modVal: '_',
      prefix: 'cn',
    },
    localIdent: getLocalIdentOptions(localIdent, loaderContext),
    exportGlobals: false,
    exportOnlyLocals: false,
    sourceMap: loaderContext.sourceMap || false,
    importLoaders: 0,
    auto: undefined,
    ...restRawOptions,
  };
};
