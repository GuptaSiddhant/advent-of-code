import { readInput } from "./_helpers.ts";

const elves = readInput("1")
  .split("\n\n")
  .map((elf) =>
    elf
      .split("\n")
      .reduce((calories, input) => parseInt(input, 10) + calories, 0)
  )
  .toSorted((a, b) => b - a);

// 1
console.log(elves[0]);

// 2
console.log(elves[0] + elves[1] + elves[2]);
