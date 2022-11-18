// @ts-nocheck
export var cnButton = ({ style } = {}, m = []) => {
  var r = ['button'].concat(m);
  if (style === 'rounded') r.push('button_style_rounded');
  if (style === 'flat') r.push('button_style_flat');
  return r.filter((x) => x).join(' ');
};
