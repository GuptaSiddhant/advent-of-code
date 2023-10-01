/**
 * Advent of code 2022 (TS) - Day 10
 * @see https://adventofcode.com/2022/day/10
 */

import { readInputLines } from "./_helpers.ts";

const input = readInputLines("10");

const commands: Command[] = input.map((line) => {
  const [variant, value] = line.split(" ");
  return {
    variant: variant as CommandVariant,
    value: Number.parseInt(value, 10) || 0,
  };
});

console.log("Part 1:", part1());
console.log("Part 2:", part2());

// Part 1:
function part1() {
  let X = 1;
  let currentCycle = 1;
  let cmdIndex = 0;
  let tickFn: (() => void) | undefined;

  let totalSignalStrength = 0;

  while (cmdIndex < commands.length) {
    if (currentCycle % 40 === 20) {
      const signalStrength = currentCycle * X;
      totalSignalStrength += signalStrength;
    }

    if (tickFn) {
      tickFn();
      continue;
    }

    const { variant, value } = commands.at(cmdIndex)!;

    if (variant === CommandVariant.NOOP) {
      cmdIndex++;
    }
    if (variant === CommandVariant.ADDX) {
      tickFn = () => {
        cmdIndex++;
        currentCycle++;
        X += value || 0;
        tickFn = undefined;
      };
    }
    currentCycle++;
  }

  return totalSignalStrength;
}

// Part 2:
function part2() {
  const CRT_WIDTH = 40;
  const CRT_HEIGHT = 6;
  let X = 1;
  let currentCycle = 0;

  const display: string[][] = Array.from({ length: CRT_HEIGHT }, () =>
    Array.from({ length: CRT_WIDTH }, () => ".")
  );

  const values = commands.reduce((acc, { variant, value }) => {
    if (variant === CommandVariant.ADDX) {
      acc.push(undefined, value);
    } else acc.push(undefined);
    return acc;
  }, [] as Array<number | undefined>);

  values.forEach((value) => {
    const currentRow = Math.floor(currentCycle / CRT_WIDTH);
    const currentPixelInRow = currentCycle % CRT_WIDTH;
    const displayRow = display[currentRow];

    if (
      displayRow &&
      currentPixelInRow - 1 <= X &&
      X <= currentPixelInRow + 1
    ) {
      displayRow[currentPixelInRow] = "#";
    }

    currentCycle++;
    if (typeof value === "number") {
      X += value;
    }
  });

  display.forEach((row) => console.log(row.join("")));
  return 0;
}

// Helpers

type Command = {
  variant: CommandVariant;
  value: number;
};

const enum CommandVariant {
  NOOP = "noop",
  ADDX = "addx",
}
