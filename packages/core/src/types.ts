export type NamingOptions = {
  prefix: string;
  elem: string;
  modName: string;
  modVal: string;
};

export type BemParams = {
  base: string;
  mods: Record<string, Record<string, string>>;
};

export type BemFunctionName = string;

export type BemStructure = Record<BemFunctionName, BemParams>;