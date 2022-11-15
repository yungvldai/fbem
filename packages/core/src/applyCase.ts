export const applyCase = (string: string, type: 'camel' | 'pascal' = 'camel') => {
  let result = '';
  let nextShouldBeCapital = false;

  for (let i = 0; i < string.length; i += 1) {
    const char = string.charAt(i);

    if (!/[a-z0-9]/i.test(char)) {
      nextShouldBeCapital = true;
      continue;
    }

    if (nextShouldBeCapital) {
      result += char.toUpperCase();
      nextShouldBeCapital = false;
      continue;
    }

    result += char;
  }

  const firstChar =
    type === 'camel' ? result.charAt(0).toLowerCase() : result.charAt(0).toUpperCase();

  return firstChar + result.slice(1);
};
