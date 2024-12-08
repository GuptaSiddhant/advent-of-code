// https://github.com/toblu/advent-of-code-client/blob/main/src/util/transforms.ts

/**
 * Splits the data by a custom separator.
 * @param {string | RegExp} separator - the custom separator
 * @returns { (data: string) => string[] }
 */
export const createSplitter = (separator: string | RegExp) => (data: string) =>
  data.split(separator);

/**
 * Splits the data by line breaks.
 * @param {string} data
 */
export const lines = createSplitter("\n");

/**
 * Splits the data by line breaks and parses string values into numbers.
 * @param {string} data
 */
export const numbers = (data: string) => lines(data).map(Number);

export const createLinesOfNumbers =
  (numSeparator: string | RegExp = /\s+/) =>
  (data: string) =>
    lines(data).map((line) => {
      const values = createSplitter(numSeparator)(line);
      return values.map(Number);
    });
