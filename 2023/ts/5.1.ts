import { findLocation } from "./5.helper.ts";
import { readInput } from "./_helpers.ts";

const filename = "5";
const actualInput = readInput(filename);

console.log("Part 1 (Actual) :", part1(actualInput));

function part1(input: string) {
  const seeds = input
    .split("\n")[0]
    .split(" ")
    .map(Number)
    .filter((n) => !Number.isNaN(n));

  return Math.min(...seeds.map(findLocation));
}
