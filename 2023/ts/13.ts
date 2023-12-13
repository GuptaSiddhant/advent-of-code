/**
 * Advent of code 2023 (TS) - Day 13
 * @see https://adventofcode.com/2023/day/13
 */

import { readInput } from "./_helpers.ts";

const filename = "13";
const actualInput = readInput(filename);
const exampleInput = readInput(filename + ".example");

console.log("Part 1 (Example):", part1(exampleInput)); // 405
console.log("Part 1 (Actual) :", part1(actualInput));
// console.log("Part 2 (Example):", part2(exampleInput)); // 525152
// console.log("Part 2 (Actual) :", part2(actualInput));

function part1(input: string) {
  const patterns = input.split("\n\n").map((set) => set.split("\n"));
  const mirrors = patterns.map((pattern) => {
    const h = findMirrorHorizontally(pattern);
    if (h !== 0) return { mirror: h, horizontal: true };
    const v = findMirrorVertically(pattern);
    return { mirror: v, horizontal: false };
  });

  return mirrors.reduce(
    (acc, { mirror, horizontal }) => acc + mirror * (horizontal ? 100 : 1),
    0
  );
}

// function part2(input: string) {}

// Helpers

function findMirrorHorizontally(pattern: string[]): number {
  const length = pattern.length;
  let mirror = length - 1; //Math.floor((length + 1) / 2);

  while (mirror >= 0) {
    const max = Math.min(mirror, length - mirror);
    const top = pattern.slice(mirror - max, mirror).join(" ");
    const bottom = pattern
      .slice(mirror, mirror + max)
      .toReversed()
      .join(" ");

    if (top === bottom) break;
    else --mirror;
  }

  return mirror;
}

function findMirrorVertically(pattern: string[]): number {
  const length = pattern[0].length;
  let mirror = length - 1; //Math.floor((length + 1) / 2);

  while (mirror >= 0) {
    const max = Math.min(mirror, length - mirror);

    const left = pattern
      .map((row) => row.slice(mirror - max, mirror))
      .join(" ");
    const right = pattern
      .map((row) =>
        row
          .slice(mirror, mirror + max)
          .split("")
          .toReversed()
          .join("")
      )
      .join(" ");

    if (left === right) break;
    else --mirror;
  }

  return mirror;
}
