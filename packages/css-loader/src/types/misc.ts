export type Import = {
  type?: string;
  importName: string;
  url: string;
  index?: number;
  icss?: boolean;
  layer?: string;
  supports?: string;
  media?: string;
  dedupe?: string;
};

export type Export = {
  name: string;
  value: string;
};

export type Replacement = {
  replacementName: string;
  importName?: string;
  hash?: string;
  needQuotes: boolean;
};
