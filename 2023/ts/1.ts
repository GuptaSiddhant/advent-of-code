/**
 * Advent of code 2023 (TS) - Day 1
 * @see https://adventofcode.com/2023/day/1
 */

import { readInput } from "./_helpers.ts";

const filename = "1";
const actualInput = readInput(filename);
const exampleInput = readInput(filename + ".example");
const AlphaNum = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
} as const;

console.log("Part 1 (Example):", part1(exampleInput));
console.log("Part 1 (Actual) :", part1(actualInput)); // 54634
console.log("Part 2 (Example):", part2(exampleInput));
console.log("Part 2 (Actual) :", part2(actualInput)); // 53855

// Part 1:
function part1(input: string) {
  const lines = input.split("\n");
  const digits = lines.map((line) => {
    const digits = line.match(/\d/g) || [0];
    const firstDigit = digits.at(0) ?? 0;
    const lastDigit = digits.at(-1) ?? 0;
    return String(firstDigit) + String(lastDigit);
  });
  const sum = digits.reduce(
    (sum, digit) => sum + Number.parseInt(digit, 10),
    0
  );

  return sum;
}

// Part 2:
function part2(input: string) {
  const lines = input.split("\n");
  const digits = lines.map(parseLineToDigits);
  const sum = digits.reduce((sum, digit) => sum + digit, 0);

  return sum;
}

// Helpers
function parseLineToDigits(input: string): number {
  const keys = Object.keys(AlphaNum);
  const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  let first = "";
  let firstIndex = Number.POSITIVE_INFINITY;
  [...keys, ...nums].forEach((x) => {
    const index = input.indexOf(x.toString());
    if (index > -1 && index < firstIndex) {
      first = x.toString();
      firstIndex = index;
    }
  });

  let last = "";
  let lastIndex = -1;
  [...keys, ...nums].forEach((x) => {
    const index = input.lastIndexOf(x.toString());
    if (index > -1 && index > lastIndex) {
      last = x.toString();
      lastIndex = index;
    }
  });

  const firstDigit =
    first.length > 1
      ? AlphaNum[first as keyof typeof AlphaNum]
      : Number.parseInt(first, 10);
  const lastDigit =
    last.length > 1
      ? AlphaNum[last as keyof typeof AlphaNum]
      : Number.parseInt(last, 10);

  const value = Number.parseInt(String(firstDigit) + String(lastDigit), 10);

  return value;
}
