import { readInput } from "./_helpers.ts";

const input = readInput("6");

const answer1 = detectUniqueChars(input, 4);
console.log("Part 1:", answer1);

const answer2 = detectUniqueChars(input, 14);
console.log("Part 2:", answer2);

function detectUniqueChars(str: string, size: number): number {
  return str.split("").findIndex((_, i, arr) => {
    const chars = arr.slice(i - size, i);
    return new Set(chars).size === size;
  });
}
