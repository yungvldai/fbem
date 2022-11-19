import { createBemStructure } from '../src';

describe('createBemStructure', () => {
  it('should work correctly #1', () => {
    const bemStructure = createBemStructure(
      {
        block: 'className-0',
        block__elem: 'className-1',
        block__elem_mod1_val1: 'className-2',
        block__elem_mod1_val2: 'className-3',
        block__elem_mod2: 'className-4',
      },
      {
        elem: '__',
        modName: '_',
        modVal: '_',
        prefix: 'cn',
      }
    );

    expect(bemStructure).toEqual({
      cnBlock: {
        base: 'className-0',
        mods: {},
      },
      cnBlockElem: {
        base: 'className-1',
        mods: {
          mod1: {
            type: 'string',
            values: {
              val1: 'className-2',
              val2: 'className-3',
            },
          },
          mod2: {
            type: 'boolean',
            value: 'className-4',
          },
        },
      },
    });
  });

  it('should work correctly #2', () => {
    const bemStructure = createBemStructure(
      {
        block: 'className-0',
      },
      {
        elem: '__',
        modName: '_',
        modVal: '_',
        prefix: 'cn',
      }
    );

    expect(bemStructure).toEqual({
      cnBlock: {
        base: 'className-0',
        mods: {},
      },
    });
  });

  it('should work correctly #3', () => {
    const bemStructure = createBemStructure(
      {
        block: 'className-0',
        'the-second-block__elem': 'className-1',
        'the-third-block__elem_mod1_val-with-dashes': 'className-2',
        'block__elem-with-dashes_mod1_val2': 'className-3',
        'block__elem_mod-with-dashes': 'className-4',
      },
      {
        elem: '__',
        modName: '_',
        modVal: '_',
        prefix: 'cn',
      }
    );

    expect(bemStructure).toEqual({
      cnBlock: {
        base: 'className-0',
        mods: {},
      },
      cnTheThirdBlockElem: {
        base: '',
        mods: {
          mod1: {
            type: 'string',
            values: {
              'val-with-dashes': 'className-2',
            },
          },
        },
      },
      cnBlockElem: {
        base: '',
        mods: {
          modWithDashes: {
            type: 'boolean',
            value: 'className-4',
          },
        },
      },
      cnBlockElemWithDashes: {
        base: '',
        mods: {
          mod1: {
            type: 'string',
            values: {
              val2: 'className-3',
            },
          },
        },
      },
      cnTheSecondBlockElem: {
        base: 'className-1',
        mods: {},
      },
    });
  });

  it('should work correctly #4', () => {
    const bemStructure = createBemStructure(
      {
        'block_mod_mod-val': 'className-0',
      },
      {
        elem: '__',
        modName: '_',
        modVal: '_',
        prefix: 'cn',
      }
    );

    expect(bemStructure).toEqual({
      cnBlock: {
        base: '',
        mods: {
          mod: {
            type: 'string',
            values: {
              'mod-val': 'className-0',
            },
          },
        },
      },
    });
  });
});
