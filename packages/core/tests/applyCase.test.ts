import { applyCase } from '../src/applyCase';

const CASES = [
  {
    string: 'hello-world',
    case: 'camel',
    expected: 'helloWorld',
  },
  {
    string: 'hello---world',
    case: 'camel',
    expected: 'helloWorld',
  },
  {
    string: 'hello-world',
    case: 'pascal',
    expected: 'HelloWorld',
  },
  {
    string: 'hello-world-123',
    case: 'camel',
    expected: 'helloWorld123',
  },
  {
    string: '12-hello-world',
    case: 'camel',
    expected: '12HelloWorld',
  },
  {
    string: 'he-lLo-worlD',
    case: 'camel',
    expected: 'heLLoWorlD',
  },
  {
    string: 'hElLoWoRlD',
    case: 'camel',
    expected: 'hElLoWoRlD',
  },
  {
    string: 'h-e-l-l-o',
    case: 'camel',
    expected: 'hELLO',
  },
  {
    string: '---hello-world-123',
    case: 'camel',
    expected: 'helloWorld123',
  },
  {
    string: 'hello-world----',
    case: 'pascal',
    expected: 'HelloWorld',
  },
];

describe('applyCase', () => {
  for (const testCase of CASES) {
    it(`should work correctly '${testCase.string}' correctly`, () => {
      expect(applyCase(testCase.string, testCase.case as Parameters<typeof applyCase>[1])).toEqual(
        testCase.expected
      );
    });
  }
});
