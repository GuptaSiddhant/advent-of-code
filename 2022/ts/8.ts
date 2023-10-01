/**
 * Advent of code 2022 - Day 8
 * @see https://adventofcode.com/2022/day/8
 */

import { readInput } from "./_helpers.ts";

const grid = readInput("8")
  .split("\n")
  .map((line) => line.split("").map((height) => Number.parseInt(height, 10)));

console.log("Part 1:", part1());
console.log("Part 2:", part2());

// Part 1: Find visible trees
function part1() {
  let visibleTrees = 0;
  grid.forEach((row, rowIndex, rows) => {
    row.forEach((height, cellIndex, cells) => {
      // Perimeter
      if (
        rowIndex === 0 ||
        cellIndex === 0 ||
        rowIndex === rows.length - 1 ||
        cellIndex === cells.length - 1
      ) {
        return visibleTrees++;
      }

      // Inner grid
      // Left
      const leftMaxHeight = Math.max(...cells.slice(0, cellIndex));
      if (height > leftMaxHeight) return visibleTrees++;
      // Right
      const rightMaxHeight = Math.max(...cells.slice(cellIndex + 1));
      if (height > rightMaxHeight) return visibleTrees++;

      const column = rows.map((row) => row[cellIndex]);
      // Up
      const upMaxHeight = Math.max(...column.slice(0, rowIndex));
      if (height > upMaxHeight) return visibleTrees++;
      // Down
      const downMaxHeight = Math.max(...column.slice(rowIndex + 1));
      if (height > downMaxHeight) return visibleTrees++;
    });
  });

  return visibleTrees;
}

// Part 2: Calc visibility score
function part2() {
  let maxScore = 0;
  grid.forEach((row, rowIndex, rows) => {
    row.forEach((height, cellIndex, cells) => {
      const column = rows.map((row) => row[cellIndex]);

      const rightCells = cells.slice(cellIndex + 1);
      const rightScore =
        rightCells.findIndex((cell) => cell >= height) + 1 || rightCells.length;

      const leftCells = cells.slice(0, cellIndex).reverse();
      const leftScore =
        leftCells.findIndex((cell) => cell >= height) + 1 || leftCells.length;

      const upCells = column.slice(0, rowIndex).reverse();
      const upScore =
        upCells.findIndex((cell) => cell >= height) + 1 || upCells.length;

      const downCells = column.slice(rowIndex + 1);
      const downScore =
        downCells.findIndex((cell) => cell >= height) + 1 || downCells.length;

      const visibilityScore = leftScore * rightScore * upScore * downScore;
      if (visibilityScore > maxScore) maxScore = visibilityScore;
    });
  });

  return maxScore;
}
