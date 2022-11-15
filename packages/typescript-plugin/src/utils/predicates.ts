import { DEFAULT_MATCH } from 'src/constants';

export const isRelative = (fileName: string) => /^\.\.?($|[\\/])/.test(fileName);

export const createIsCSS =
  (match: RegExp = DEFAULT_MATCH) =>
  (fileName: string) =>
    match.test(fileName);
