/**
 * Advent of code 2024 (TS) - Day 2
 * @see https://adventofcode.com/2024/day/2
 */

import { readInput } from "./_helpers.ts";
import { assertEquals } from "@std/assert";

const filename = "2";
const actualInput = readInput(filename);
const exampleInput = readInput(filename + ".example");

console.log("Part 1 (Example)", part1(exampleInput));
assertEquals(part1(exampleInput), 2);
console.log("Part 1 (Actual) :", part1(actualInput)); // 472
console.log("Part 2 (Example):", part2(exampleInput)); // 4
console.log("Part 2 (Actual) :", part2(actualInput)); //
// not 505

// Part 1:
function part1(input: string) {
  const { reports } = x(input);
  let safeCount = 0;

  for (const report of reports) {
    if (checkSafeReport(report)) {
      safeCount++;
    }
  }

  return safeCount;
}

// Part 2:
function part2(input: string) {
  const { reports } = x(input);
  let safeCount = 0;

  for (let i = 0; i < reports.length; i++) {
    const report = reports[i];

    if (checkSafeReport(report)) {
      safeCount++;
    } else {
      const reportCombinations = Array.from({ length: report.length }).map(
        (_, j) => {
          return [...report.slice(0, j), ...report.slice(j + 1)];
        }
      );
      const isAnySafe = reportCombinations.some(checkSafeReport);

      if (isAnySafe) {
        safeCount++;
      }
    }
  }

  return safeCount;
}

function x(input: string) {
  const reports = input
    .split("\n")
    .map((line) => line.split(/\s+/).map(Number));

  return { reports };
}

function checkSafeReport(report: number[]): boolean {
  let prevLevel: number | null = null;
  let direction: "inc" | "dec" | undefined;

  for (let i = 0; i < report.length; i++) {
    const level = report[i]!;
    if (prevLevel === null) {
      prevLevel = level;
      continue;
    }

    const diff = prevLevel - level;

    // console.log(prevLevel, level, diff);
    if (Math.abs(diff) < 1 || Math.abs(diff) > 3) {
      return false;
    }

    const newDirection: typeof direction = diff < 0 ? "dec" : "inc";

    if (!direction) {
      direction = newDirection;
    } else {
      // console.log(direction, newDirection);
      if (direction !== newDirection) {
        return false;
      }
    }

    prevLevel = level;
  }

  return true;
}
