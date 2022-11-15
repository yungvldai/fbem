export const isRelative = (fileName: string) => /^\.\.?($|[\\/])/.test(fileName);

export const createIsCSS = (match: RegExp) => (fileName: string) => match.test(fileName);
