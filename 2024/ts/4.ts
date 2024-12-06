/**
 * Advent of code 2024 (TS) - Day 4
 * @see https://adventofcode.com/2024/day/4
 */

import {
  readInput,
  convertInputToGrid,
  parseCoordKey,
  findNextCoordKeyInDir,
  findDirFromCoord,
  getAllInDirFromCoord,
  traverseGrid,
} from "./_helpers.ts";

const filename = "4";
const actualInput = readInput(filename);
const exampleInput = readInput(filename + ".example");

const values = ["X", "M", "A", "S"] as const;
type Value = (typeof values)[number];

console.log("Part 1 (Example):", part1(exampleInput)); // 18
console.log("Part 1 (Actual) :", part1(actualInput)); // 2642
console.log("Part 2 (Example):", part2(exampleInput)); // 9
console.log("Part 2 (Actual) :", part2(actualInput)); // 1974

// Part 1:
function part1(input: string) {
  const { grid, maxX, maxY } = convertInputToGrid<Value>(input);
  const startingCoords = traverseGrid(grid, [...grid.keys()], maxX, maxY, "X");
  const filtered = startingCoords
    .map(([key, nextKey]) =>
      getAllInDirFromCoord(grid, key, findDirFromCoord(key, nextKey))
    )
    .filter(Boolean);

  return filtered.length;
}

function part2(input: string) {
  const { grid, maxX, maxY } = convertInputToGrid<Value>(input);
  const startingCoords = Array.from(
    grid.entries().filter(([key, value]) => {
      const { x, y } = parseCoordKey(key);
      if (x < 1 || x > maxX - 1) return false;
      if (y < 1 || y > maxY - 1) return false;
      return value === "A";
    })
  );
  const filtered = startingCoords.filter(([key]) => {
    const tlValue = grid.get(findNextCoordKeyInDir(key, "TL"));
    const trValue = grid.get(findNextCoordKeyInDir(key, "TR"));
    const blValue = grid.get(findNextCoordKeyInDir(key, "BL"));
    const brValue = grid.get(findNextCoordKeyInDir(key, "BR"));

    if (!tlValue || !trValue || !blValue || !brValue) return false;

    if (tlValue === "M" && trValue === "M") {
      return blValue === "S" && brValue === "S";
    }
    if (tlValue === "M" && blValue === "M") {
      return trValue === "S" && brValue === "S";
    }
    if (blValue === "M" && brValue === "M") {
      return tlValue === "S" && trValue === "S";
    }
    if (trValue === "M" && brValue === "M") {
      return tlValue === "S" && blValue === "S";
    }

    return false;
  });

  return filtered.length;
}
