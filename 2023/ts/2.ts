/**
 * Advent of code 2023 (TS) - Day 2
 * @see https://adventofcode.com/2023/day/2
 */

import { readInput } from "./_helpers.ts";

const filename = "2";
const actualInput = readInput(filename);
const exampleInput = readInput(filename + ".example");

console.log("Part 1 (Example):", part1(exampleInput));
console.log("Part 1 (Actual) :", part1(actualInput)); // 54634
console.log("Part 2 (Example):", part2(exampleInput));
console.log("Part 2 (Actual) :", part2(actualInput)); // 53855

// Part 1:
function part1(input: string) {
  const MAX_RED = 12;
  const MAX_GREEN = 13;
  const MAX_BLUE = 14;

  const games = input.split("\n").map(parseGame);
  const maxValues = calcMaxRGB(games);
  const indicesSum = maxValues.reduce((acc, game, index) => {
    const ID = index + 1;
    const isValid =
      game.red <= MAX_RED && game.green <= MAX_GREEN && game.blue <= MAX_BLUE;

    return isValid ? acc + ID : acc;
  }, 0);

  return indicesSum;
}

// Part 2:
function part2(input: string) {
  const games = input.split("\n").map(parseGame);
  const maxValues = calcMaxRGB(games);
  const powers = maxValues
    .map((game) => {
      const { red, green, blue } = game;
      return red * green * blue;
    })
    .reduce((acc, val) => acc + val, 0);

  return powers;
}

// Helpers
function parseGame(game: string) {
  return game.split(": ")[1].split("; ").map(getRGBFromReveal);
}

function getRGBFromReveal(reveal: string) {
  let red = 0;
  let green = 0;
  let blue = 0;

  reveal.split(", ").map((entry) => {
    const [val, color] = entry.split(" ");
    if (color === "red") red = parseInt(val);
    if (color === "green") green = parseInt(val);
    if (color === "blue") blue = parseInt(val);
  });

  return { red, green, blue };
}

function calcMaxRGB(games: ReturnType<typeof parseGame>[]) {
  return games.map((game) => {
    let red = 0;
    let green = 0;
    let blue = 0;

    game.forEach((reveal) => {
      red = Math.max(red, reveal.red);
      green = Math.max(green, reveal.green);
      blue = Math.max(blue, reveal.blue);
    });

    return { red, green, blue };
  });
}
