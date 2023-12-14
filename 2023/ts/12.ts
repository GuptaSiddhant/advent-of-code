/**
 * Advent of code 2023 (TS) - Day 12
 * @see https://adventofcode.com/2023/day/12
 */

import { readInput, memoize } from "./_helpers.ts";

const filename = "12";
const actualInput = readInput(filename);
const exampleInput = readInput(filename + ".example");

const memoizedFindPossibilities = memoize(findPossibilities);

// console.log("Part 1 (Example):", part1(exampleInput)); // 21
// console.log("Part 1 (Actual) :", part1(actualInput));
console.log("Part 2 (Example):", part2(exampleInput)); // 525152
console.log("Part 2 (Actual) :", part2(actualInput));

function part1(input: string) {
  const rows = parseInput(input);
  const possibilities = rows.map(({ springs, damagedList }, i) => {
    console.log(i, springs);
    return memoizedFindPossibilities(springs, damagedList);
  });
  return possibilities.reduce((acc, a) => acc + a, 0);
}

function part2(input: string) {
  const rows = parseInput(input).map(({ springs, damagedList }) => ({
    springs: Array(5).fill(springs).join("?"),
    damagedList: Array(5).fill(damagedList).flat(),
  }));

  const possibilities = rows.map(({ springs, damagedList }, i) => {
    console.log(i, springs);
    return memoizedFindPossibilities(springs, damagedList);
  });
  return possibilities.reduce((acc, a) => acc + a, 0);
}

// Helpers

function parseInput(input: string) {
  return input.split("\n").map((line) => {
    const [springs, values] = line.split(" ");
    const damagedList = values.split(",").map(Number);
    return { springs, damagedList };
  });
}

// https://gist.github.com/Nathan-Fenner/781285b77244f06cf3248a04869e7161
function findPossibilities(springs: string, list: number[]): number {
  if (springs.length === 0) {
    if (list.length === 0) {
      return 1;
    }
    return 0;
  }
  if (list.length === 0) {
    for (let i = 0; i < springs.length; i++) {
      if (springs[i] === "#") {
        return 0;
      }
    }
    return 1;
  }

  if (springs.length < sum(list) + list.length - 1) {
    // The line is not long enough for all runs
    return 0;
  }

  if (springs[0] === ".") {
    return findPossibilities(springs.slice(1), list);
  }
  if (springs[0] === "#") {
    const [run, ...leftoverRuns] = list;
    for (let i = 0; i < run; i++) {
      if (springs[i] === ".") {
        return 0;
      }
    }
    if (springs[run] === "#") {
      return 0;
    }

    return findPossibilities(springs.slice(run + 1), leftoverRuns);
  }
  // Otherwise dunno first spot, pick
  return (
    findPossibilities("#" + springs.slice(1), list) +
    findPossibilities("." + springs.slice(1), list)
  );
}

function sum(...nums: number[] | (readonly number[])[]): number {
  let tot = 0;
  for (const x of nums) {
    if (typeof x === "number") {
      tot += x;
    } else {
      for (const y of x) {
        tot += y;
      }
    }
  }
  return tot;
}
