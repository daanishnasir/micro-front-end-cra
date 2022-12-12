import { convertToProperCase, convertCamelToTitleCase, makeTitleCase, makeKebabCase } from '.';

describe('text-casing', () => {
  describe('convertToProperCase', () => {
    it('should return first letter of each word as capital', () => {
      expect(convertToProperCase('rio de janeiro')).toBe('Rio De Janeiro');
    });

    it('should return first letter capitalized if string contains only one word', () => {
      expect(convertToProperCase('dallas')).toBe('Dallas');
    });

    it('should return an empty string if an empty string is passed', () => {
      expect(convertToProperCase(' ')).toBe('');
    });

    it('should remove extra white space', () => {
      expect(convertToProperCase(' rio de   janeiro')).toBe('Rio De Janeiro');
    });

    it('should format if string is in all caps', () => {
      expect(convertToProperCase('RIO DE JANEIRO')).toBe('Rio De Janeiro');
    });
  });

  describe('convertCamelToTitleCase', () => {
    it('should return value title cased', () => {
      expect(convertCamelToTitleCase('true')).toBe('True');
    });

    it('should handle multiple words', () => {
      expect(convertCamelToTitleCase('easterEgg')).toBe('Easter Egg');
    });

    it('should handle words with custom delimeter', () => {
      expect(convertCamelToTitleCase('EasterEgg')).toBe('Easter Egg');
    });
  });

  describe('makeTitleCase', () => {
    it('should return value title cased', () => {
      expect(makeTitleCase('true')).toBe('True');
    });

    it('should handle multiple words', () => {
      expect(makeTitleCase('easter egg')).toBe('Easter Egg');
    });

    it('should handle words with custom delimeter', () => {
      expect(makeTitleCase('easter egg', /_/)).toBe('Easter Egg');
    });
  });

  describe('makeKebabCase', () => {
    const phrase1 = 'This needs to be KEBAB Cased 123';
    const phrase2 = 'some.test+eXTrA@emailTest.com';
    it('should return a string in kebab-case', () => {
      expect(makeKebabCase(phrase1)).toBe('this-needs-to-be-kebab-cased-123');
      expect(makeKebabCase(phrase2)).toBe('some-test-extra-emailtest-com');
    });
  });
});
