export const convertToProperCase = (str: string): string => {
  return (
    str
      ?.toLowerCase()
      .split(' ')
      .filter(Boolean)
      .map((s) => s[0].toUpperCase() + s.slice(1).toLowerCase())
      .join(' ') ?? ''
  );
};

export const convertCamelToTitleCase = (str: string): string => {
  return str
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/^./, (match) => match.toUpperCase())
    .trim();
};

export function makeTitleCase(str: string, del?: RegExp): string {
  let upper = true;
  let newStr = '';
  for (let i = 0, l = str.length; i < l; i++) {
    if (str[i] == ' ' || (del && str[i].match(del))) {
      upper = true;
      newStr += ' ';
      continue;
    }
    newStr += upper ? str[i].toUpperCase() : str[i].toLowerCase();
    upper = false;
  }
  return newStr;
}

export const makeKebabCase = (phrase: string): string => {
  return phrase
    .toLowerCase()
    .split(/@|\.|\+| /)
    .join('-');
};
