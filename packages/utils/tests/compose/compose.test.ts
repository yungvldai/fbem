// @ts-nocheck
import { compose } from '../../src';
import { cnButton as cnButtonModDisabled } from './mocks/mod-disabled';
import { cnButton as cnButtonModStyle } from './mocks/mod-style';

describe('compose', () => {
  it('should work correctly #1', () => {
    const cnButton = compose(cnButtonModDisabled, cnButtonModStyle);

    expect(cnButton()).toBe('button');
  });

  it('should work correctly #2', () => {
    const cnButton = compose(cnButtonModStyle, cnButtonModDisabled);

    const classes = cnButton({ disabled: true }).split(' ');

    expect(classes.length).toBe(2);
    expect(classes).toContain('button');
    expect(classes).toContain('button_disabled');
  });

  it('should work correctly #3', () => {
    const cnButton = compose(cnButtonModStyle, cnButtonModDisabled);

    const classes = cnButton({ style: 'flat' }).split(' ');

    expect(classes.length).toBe(2);
    expect(classes).toContain('button');
    expect(classes).toContain('button_style_flat');
  });

  it('should work correctly #4', () => {
    const cnButton = compose(cnButtonModStyle, cnButtonModDisabled);

    const classes = cnButton({ style: 'rounded', disabled: true }).split(' ');

    expect(classes.length).toBe(3);
    expect(classes).toContain('button');
    expect(classes).toContain('button_disabled');
    expect(classes).toContain('button_style_rounded');
  });

  it('should work correctly #5', () => {
    const cnButton = compose(cnButtonModStyle, cnButtonModDisabled);

    const classes = cnButton({ style: 'flat', disabled: false }, ['mix1']).split(' ');

    expect(classes.length).toBe(3);
    expect(classes).toContain('button');
    expect(classes).toContain('mix1');
    expect(classes).toContain('button_style_flat');
  });
});
