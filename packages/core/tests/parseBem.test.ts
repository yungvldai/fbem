import { parseBem } from "../src";

const CASES = [
  {
    className: 'block',
    naming: { prefix: '', elem: '__', modName: '_', modVal: '_' },
    expected: { block: 'block', elem: '', modName: '', modVal: '' }
  },
  {
    className: 'block__elem',
    naming: { prefix: '', elem: '__', modName: '_', modVal: '_' },
    expected: { block: 'block', elem: 'elem', modName: '', modVal: '' }
  },
  {
    className: 'block__elem_mod',
    naming: { prefix: '', elem: '__', modName: '_', modVal: '_' },
    expected: { block: 'block', elem: 'elem', modName: 'mod', modVal: '' }
  },
  {
    className: 'block__elem_mod_val',
    naming: { prefix: '', elem: '__', modName: '_', modVal: '_' },
    expected: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
  },
  {
    className: 'block_mod_val',
    naming: { prefix: '', elem: '__', modName: '_', modVal: '_' },
    expected: { block: 'block', elem: '', modName: 'mod', modVal: 'val' }
  },
  {
    className: 'block_mod',
    naming: { prefix: '', elem: '__', modName: '_', modVal: '_' },
    expected: { block: 'block', elem: '', modName: 'mod', modVal: '' }
  },
  {
    className: '',
    naming: { prefix: '', elem: '__', modName: '_', modVal: '_' },
    expected: { block: '', elem: '', modName: '', modVal: '' }
  },
  {
    className: 'Block--Elem_ModName',
    naming: { prefix: '', elem: '--', modName: '_', modVal: '_' },
    expected: { block: 'Block', elem: 'Elem', modName: 'ModName', modVal: '' }
  },
]

describe('parseBem', () => {
  for (const testCase of CASES) {
    it(`should parse '${testCase.className}' correctly`, () => {
      expect(parseBem(testCase.className, testCase.naming)).toEqual(testCase.expected);
    })
  }
})