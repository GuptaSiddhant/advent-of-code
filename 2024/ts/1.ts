/**
 * Advent of code 2024 (TS) - Day 1
 * @see https://adventofcode.com/2024/day/1
 */

import { readInput } from "./_helpers.ts";

const filename = "1";
const actualInput = readInput(filename);
const exampleInput = readInput(filename + ".example");

console.log("Part 1 (Example):", part1(exampleInput)); // 11
console.log("Part 1 (Actual) :", part1(actualInput)); // 1590491
console.log("Part 2 (Example):", part2(exampleInput)); // 31
console.log("Part 2 (Actual) :", part2(actualInput)); // 22588371

// Part 1:
function part1(input: string) {
  const { array1, array2 } = x(input);
  array1.sort();
  array2.sort();

  const distances = array1.map((item, index) => {
    return Math.abs(item - array2[index]);
  });

  return distances.reduce((acc, item) => acc + item, 0);
}

// Part 2:
function part2(input: string) {
  const { array1, array2 } = x(input);
  const map = new Map<number, number>();

  let score = 0;

  for (const item of array1) {
    if (map.has(item)) {
      const oldScore = map.get(item)!;
      score += item * oldScore;
    } else {
      const newScore = array2.filter((i2) => i2 === item).length;
      map.set(item, newScore);
      score += item * newScore;
    }
  }

  return score;
}

function x(input: string) {
  const array1: number[] = [];
  const array2: number[] = [];
  const lines = input
    .split("\n")
    .map((line) => line.split(/\s+/) as [string, string]);
  for (const line of lines) {
    array1.push(Number(line[0]));
    array2.push(Number(line[1]));
  }
  return { array1, array2 };
}
