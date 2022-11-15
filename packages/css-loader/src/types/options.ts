import { NamingOptions } from '@fbem/core';
import { LoaderContext } from 'webpack';

export type RawLocalIdentOptions = {
  name?: string;
  context?: string;
  hashSalt?: string;
  hashDigest?: string;
  hashDigestLength?: number;
  hashFunction?: any; // TODO
  hashStrategy?: 'resource-path-and-local-name' | 'minimal-subset';
  regExp?: string | RegExp;
  get?: (context: LoaderContext<Options>, localIdentName: string, localName: string) => string;
};

export type RawOptions = {
  url?: boolean | { filter: (url: string, resourcePath: string) => boolean };
  import?: boolean | { filter: (url: string, media: string, resourcePath: string) => boolean };
  naming?: NamingOptions;
  localIdent?: RawLocalIdentOptions;
  exportGlobals?: boolean;
  exportOnlyLocals?: boolean;
  sourceMap?: boolean;
  importLoaders?: number;
  auto?: RegExp | boolean | ((resourcePath: string) => boolean);
};

export type LocalIdentOptions = Omit<RawLocalIdentOptions, 'name' | 'context'> &
  Required<Pick<RawLocalIdentOptions, 'name' | 'context'>>;

export type Options = Required<Omit<RawOptions, 'localIdent' | 'auto'>> & {
  localIdent: LocalIdentOptions;
  auto: RegExp | boolean | ((resourcePath: string) => boolean) | undefined;
};
