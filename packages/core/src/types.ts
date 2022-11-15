export type NamingOptions = {
  prefix: string;
  elem: string;
  modName: string;
  modVal: string;
};

export type BemParams = {
  base: string;
  mods: Record<string, Mod>;
};

export type Mod = StringMod | BooleanMod;

export type StringMod = {
  type: 'string';
  values: Record<string, string>;
};

export type BooleanMod = {
  type: 'boolean';
  value: string;
};

export type BemFunctionName = string;

export type BemStructure = Record<BemFunctionName, BemParams>;
