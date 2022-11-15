import { NamingOptions } from '@fbem/core';

export interface PostcssOptions {
  excludePlugins?: string[];
  useConfig?: boolean;
}

export interface Options {
  match: string;
  naming: NamingOptions;
  postcssOptions?: PostcssOptions;
}
