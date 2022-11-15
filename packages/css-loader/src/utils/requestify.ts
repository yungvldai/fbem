import { fileURLToPath } from 'url';

import { NATIVE_WIN32_PATH_REGEXP, MODULE_REQUEST_REGEXP } from '../constants';

const urlToRequest = (url: string, root?: string) => {
  let request: string;

  if (NATIVE_WIN32_PATH_REGEXP.test(url)) {
    // absolute windows path, keep it
    request = url;
  } else if (typeof root !== 'undefined' && /^\//.test(url)) {
    request = root + url;
  } else if (/^\.\.?\//.test(url)) {
    // A relative url stays
    request = url;
  } else {
    // every other url is threaded like a relative url
    request = `./${url}`;
  }

  // A `~` makes the url an module
  if (MODULE_REQUEST_REGEXP.test(request)) {
    request = request.replace(MODULE_REQUEST_REGEXP, '');
  }

  return request;
};

export const requestify = (url: string, rootContext: string, needToResolveURL = true) => {
  if (needToResolveURL) {
    if (/^file:/i.test(url)) {
      return fileURLToPath(url);
    }

    return url.charAt(0) === '/' ? urlToRequest(url, rootContext) : urlToRequest(url);
  }

  if (url.charAt(0) === '/' || /^file:/i.test(url)) {
    return url;
  }

  // A `~` makes the url an module
  if (MODULE_REQUEST_REGEXP.test(url)) {
    return url.replace(MODULE_REQUEST_REGEXP, '');
  }

  return url;
};
