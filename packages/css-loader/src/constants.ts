export const WEBPACK_IGNORE_COMMENT_REGEXP = /webpackIgnore:(\s+)?(true|false)/;

export const NATIVE_WIN32_PATH_REGEXP = /^[a-z]:[/\\]|^\\\\/i;

export const MODULE_REQUEST_REGEXP = /^[^?]*~/;

export const ABSOLUTE_SCHEME_REGEXP = /^[a-z0-9+\-.]+:/i;

export const MODULES_REGEXP = /\.module(s)?\.\w+$/i;

export const RELATIVE_PATH_REGEXP = /^\.\.?[/\\]/;

export const NO_MOD_VAL = '!';

export const URL_FUNC_REGEXP = /url/i;

export const IMAGE_SET_FUNC_REGEXP = /^(?:-webkit-)?image-set$/i;

export const PARSE_DECLARATION_REGEXP = /(?:url|(?:-webkit-)?image-set)\(/i;

export const DATA_URL_REGEXP = /^data:/i;
