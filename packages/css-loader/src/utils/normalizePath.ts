import path from 'path';

export const normalizePath = (file: string) =>
  path.sep === '\\' ? file.replace(/\\/g, '/') : file;
