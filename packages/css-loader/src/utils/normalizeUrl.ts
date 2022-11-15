import { DATA_URL_REGEXP, NATIVE_WIN32_PATH_REGEXP } from '../constants';
import { unescape } from './unescape';

const fixedEncodeURIComponent = (str: string) =>
  str.replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16)}`);

export const normalizeUrl = (url: string, isStringValue: boolean) => {
  let normalizedUrl = url
    .replace(/^( |\t\n|\r\n|\r|\f)*/g, '')
    .replace(/( |\t\n|\r\n|\r|\f)*$/g, '');

  if (isStringValue && /\\(\n|\r\n|\r|\f)/.test(normalizedUrl)) {
    normalizedUrl = normalizedUrl.replace(/\\(\n|\r\n|\r|\f)/g, '');
  }

  if (NATIVE_WIN32_PATH_REGEXP.test(url)) {
    try {
      normalizedUrl = decodeURI(normalizedUrl);
    } catch (error) {
      // do nothing
    }

    return normalizedUrl;
  }

  normalizedUrl = unescape(normalizedUrl);

  if (DATA_URL_REGEXP.test(url)) {
    return fixedEncodeURIComponent(normalizedUrl);
  }

  try {
    normalizedUrl = decodeURI(normalizedUrl);
  } catch (error) {
    // do nothing
  }

  return normalizedUrl;
};
