import path from 'path';
import { LoaderContext } from 'webpack';

import { LocalIdentOptions, Options } from '../types/options';
import { normalizePath } from './normalizePath';

export const getLocalIdent = (
  loaderContext: LoaderContext<Options>,
  localIdentName: string,
  localName: string,
  options: Omit<LocalIdentOptions, 'name'>
) => {
  const { context, hashSalt, hashStrategy } = options;
  const { resourcePath } = loaderContext;
  const relativeResourcePath = normalizePath(path.relative(context, resourcePath));

  const content =
    hashStrategy === 'minimal-subset' && /\[local\]/.test(localIdentName)
      ? relativeResourcePath
      : `${relativeResourcePath}\x00${localName}`;

  let { hashFunction, hashDigest, hashDigestLength } = options;
  const matches = localIdentName.match(
    /\[(?:([^:\]]+):)?(?:(hash|contenthash|fullhash))(?::([a-z]+\d*))?(?::(\d+))?\]/i
  );

  if (matches) {
    const hashName = matches[2] || hashFunction;

    hashFunction = matches[1] || hashFunction;
    hashDigest = matches[3] || hashDigest;
    hashDigestLength = Number(matches[4]) || hashDigestLength;

    // `hash` and `contenthash` are same in `loader-utils` context
    // let's keep `hash` for backward compatibility

    localIdentName = localIdentName.replace(
      /\[(?:([^:\]]+):)?(?:hash|contenthash|fullhash)(?::([a-z]+\d*))?(?::(\d+))?\]/gi,
      () => (hashName === 'fullhash' ? '[fullhash]' : '[contenthash]')
    );
  }

  let localIdentHash = '';

  for (let tier = 0; localIdentHash.length < hashDigestLength!; tier++) {
    // TODO remove this in the next major release
    const hash =
      loaderContext.utils && typeof loaderContext.utils.createHash === 'function'
        ? loaderContext.utils.createHash(hashFunction)
        : loaderContext._compiler!.webpack.util.createHash(hashFunction);

    if (hashSalt) {
      hash.update(hashSalt);
    }

    const tierSalt = Buffer.allocUnsafe(4);

    tierSalt.writeUInt32LE(tier);

    hash.update(tierSalt);
    // TODO: bug in webpack with unicode characters with strings
    hash.update(Buffer.from(content, 'utf8'));

    localIdentHash = (localIdentHash + hash.digest(hashDigest))
      // Remove all leading digits
      .replace(/^\d+/, '')
      // Replace all slashes with underscores (same as in base64url)
      .replace(/\//g, '_')
      // Remove everything that is not an alphanumeric or underscore
      .replace(/[^A-Za-z0-9_]+/g, '')
      .slice(0, hashDigestLength);
  }

  // TODO need improve on webpack side, we should allow to pass hash/contentHash without chunk property, also `data` for `getPath` should be looks good without chunk property
  const ext = path.extname(resourcePath);
  const base = path.basename(resourcePath);
  const name = base.slice(0, base.length - ext.length);
  const data = {
    filename: path.relative(context, resourcePath),
    contentHash: localIdentHash,
    chunk: {
      name,
      hash: localIdentHash,
      contentHash: localIdentHash,
    },
  };

  // @ts-ignore ???
  let result = loaderContext._compilation!.getPath(localIdentName, data);

  if (/\[folder\]/gi.test(result)) {
    const dirname = path.dirname(resourcePath);
    let directory = normalizePath(path.relative(context, `${dirname + path.sep}_`));

    directory = directory.substring(0, directory.length - 1);

    let folder = '';

    if (directory.length > 1) {
      folder = path.basename(directory);
    }

    result = result.replace(/\[folder\]/gi, () => folder);
  }

  if (options.regExp) {
    const match = resourcePath.match(options.regExp);

    if (match) {
      match.forEach((matched, i) => {
        result = result.replace(new RegExp(`\\[${i}\\]`, 'ig'), matched);
      });
    }
  }

  return result;
};
