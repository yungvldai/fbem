# @fbem/core [![npm](https://img.shields.io/npm/v/@fbem/core)](https://www.npmjs.com/package/@fbem/core)

**@fbem/core** is a core package for functional BEM.
It provides utility for parsing BEM entities into BEM structure, 
which is used for code generation.

This package is base for all other packages. Basically you shouldn't use it.

## Getting started

```console
npm i @fbem/core
```

## Types

```typescript
type NamingOptions = {
  prefix: string;
  elem: string;
  modName: string;
  modVal: string;
};

type StringMod = {
  type: 'string';
  values: Record<string, string>;
};

type BooleanMod = {
  type: 'boolean';
  value: string;
};

type Mod = StringMod | BooleanMod;

type BemParams = {
  base: string;
  mods: Record<string, Mod>;
};

type BemFunctionName = string;

type BemStructure = Record<BemFunctionName, BemParams>;

const createBemStructure: (classesMap: Record<string, string>, naming: NamingOptions) => BemStructure;

const parseBem: (className: string, naming: NamingOptions) => {
  block: string;
  elem: string;
  modName: string;
  modVal: string;
}
```

## API

### `createBemStructure: (classesMap: Record<string, string>, naming: NamingOptions) => BemStructure`

#### Description
The function is used to convert a map of CSS classes into a structure that is used for code generation.

### `parseBem: (className: string, naming: NamingOptions) => { block: string; elem: string; modName: string; modVal: string; }`

#### Description
The function is used to parse the CSS class into its constituent entities.