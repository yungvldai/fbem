import { DATA_URL_REGEXP, NATIVE_WIN32_PATH_REGEXP } from '../constants';

export const isURLRequestable = (
  url: string,
  options: { isSupportDataURL?: boolean; isSupportAbsoluteURL?: boolean } = {}
) => {
  // Protocol-relative URLs
  if (/^\/\//.test(url)) {
    return { requestable: false, needResolve: false };
  }

  // `#` URLs
  if (/^#/.test(url)) {
    return { requestable: false, needResolve: false };
  }

  // Data URI
  if (DATA_URL_REGEXP.test(url) && options.isSupportDataURL) {
    try {
      decodeURIComponent(url);
    } catch (ignoreError) {
      return { requestable: false, needResolve: false };
    }

    return { requestable: true, needResolve: false };
  }

  // `file:` protocol
  if (/^file:/i.test(url)) {
    return { requestable: true, needResolve: true };
  }

  // Absolute URLs
  if (/^[a-z][a-z0-9+.-]*:/i.test(url) && !NATIVE_WIN32_PATH_REGEXP.test(url)) {
    if (options.isSupportAbsoluteURL && /^https?:/i.test(url)) {
      return { requestable: true, needResolve: false };
    }

    return { requestable: false, needResolve: false };
  }

  return { requestable: true, needResolve: true };
};
