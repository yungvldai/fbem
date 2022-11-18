// @ts-nocheck
export var cnButton = ({ disabled } = {}, m = []) => {
  var r = ['button'].concat(m);
  if (disabled) r.push('button_disabled');
  return r.filter((x) => x).join(' ');
};
