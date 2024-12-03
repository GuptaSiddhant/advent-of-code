/**
 * Advent of code 2024 (TS) - Day 3
 * @see https://adventofcode.com/2024/day/3
 */

import { readInput } from "./_helpers.ts";

const filename = "3";
const actualInput = readInput(filename);
const exampleInput = readInput(filename + ".example");
const regex = /mul\(\d{1,3},\d{1,3}\)/g;

console.log("Part 1 (Example):", part1(exampleInput)); // 161
console.log("Part 1 (Actual) :", part1(actualInput)); // 170068701
console.log("Part 2 (Example):", part2(exampleInput)); // 48
console.log("Part 2 (Actual) :", part2(actualInput)); // 78683433

// Part 1:
function part1(input: string) {
  const str = input.replaceAll(/\n/g, "");
  const matches = str.match(regex);

  let result = 0;
  matches?.forEach((match) => {
    result += convertStrToMul(match);
  });

  return result;
}

function part2(input: string) {
  const str = input.replaceAll(/\n/g, "");
  const matches = str.matchAll(regex);

  let result = 0;
  matches?.forEach((match) => {
    const index = match.index;
    const prefix = str.slice(0, index);
    const lastDo = prefix.lastIndexOf("do()");
    const lastDont = prefix.lastIndexOf("don't()");
    const enabled = (lastDo === -1 && lastDont === -1) || lastDo > lastDont;

    if (enabled) {
      result += convertStrToMul(match[0]);
    }
  });

  // const [first, ...rest] = str.split("don't()");

  // let result =
  //   first
  //     .match(regex)
  //     ?.reduce((acc, match) => acc + convertStrToMul(match), 0) || 0;

  // console.log(rest.length);
  // for (const part of rest) {
  //   const doPart = part.split("do()")[1];

  //   const res =
  //     doPart
  //       ?.match(regex)
  //       ?.reduce((acc, match) => acc + convertStrToMul(match), 0) || 0;

  //   result += res;
  // }

  return result;
}

function convertStrToMul(str: string) {
  const num1 = Number(str.split("(")[1].split(",")[0]);
  const num2 = Number(str.split(")")[0].split(",")[1]);
  return num1 * num2;
}
