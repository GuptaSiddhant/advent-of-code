/** @see https://adventofcode.com/2023/day/14 */

import { readInput } from "./_helpers.ts";

const filename = "14";
const actualInput = readInput(filename);
const exampleInput = readInput(filename + ".example");

const directions = ["N", "W", "S", "E"] as const;

console.log("Part 1 (Example):", part1(exampleInput)); // 136
console.log("Part 1 (Actual) :", part1(actualInput)); // 108144
console.log("Part 2 (Example):", part2(exampleInput, 1000)); // 64 (repeats after 1000)
console.log("Part 2 (Actual) :", part2(actualInput, 1000)); // 108404

function part1(input: string) {
  return calcNorthLoad(tiltLever("N", input.split("\n")));
}

function part2(input: string, length: number) {
  return calcNorthLoad(
    Array.from({ length }).reduce(
      (acc: string[]) =>
        directions.reduce((acc2, dir) => tiltLever(dir, acc2), acc),
      input.split("\n")
    )
  );
}

// Helpers

type Dir = (typeof directions)[number];

function calcNorthLoad(grid: string[]): number {
  let load = 0;
  const rows = grid.length;
  grid.forEach((row, y) => {
    row.split("").forEach((cell) => {
      if (cell === "O") load += rows - y;
    });
  });
  return load;
}

function tiltLever(dir: Dir, grid: string[]): string[] {
  switch (dir) {
    case "N":
      return moveVertically(grid, false);
    case "W":
      return moveHorizontally(grid, false);
    case "S":
      return moveVertically(grid, true);
    case "E":
      return moveHorizontally(grid, true);
    default:
      throw new Error("Not implemented");
  }
}

function moveHorizontally(grid: string[], right: boolean) {
  grid.forEach((row, y) => {
    if (right) row = row.split("").reverse().join("");
    row.split("").forEach((cell, x) => {
      if (x === 0 || cell !== "O") return;
      let z = x;
      while (z > 0) {
        if (row[z - 1] !== ".") return;
        row = row.slice(0, z - 1) + "O." + row.slice(z + 1);
        grid[y] = row;
        z--;
      }
    });
    if (right) {
      row = row.split("").reverse().join("");
      grid[y] = row;
    }
  });

  return grid;
}

function moveVertically(grid: string[], down: boolean) {
  if (down) grid.reverse();
  grid.forEach((row, y) => {
    if (y === 0) return;
    row.split("").forEach((cell, x) => {
      if (cell !== "O") return;
      let z = y;
      while (z > 0) {
        const currentRow = grid[z];
        const nextRow = grid[z - 1];
        if (nextRow[x] !== ".") return;
        grid[z] = currentRow.slice(0, x) + "." + currentRow.slice(x + 1);
        grid[z - 1] = nextRow.slice(0, x) + "O" + nextRow.slice(x + 1);
        z--;
      }
    });
  });
  if (down) grid.reverse();

  return grid;
}
