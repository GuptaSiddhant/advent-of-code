/**
 * Advent of code 2022 (TS) - Day 9
 * @see https://adventofcode.com/2022/day/9
 */

import { readInput } from "./_helpers.ts";

const moves = readInput("9")
  .split("\n")
  .map((line) => {
    const [dir, value] = line.split(" ");

    return {
      direction: dir as Direction,
      value: parseInt(value, 10),
    };
  });

console.log("Part 1:", part1());
console.log("Part 2:", part2()); // NOT SOLVED

// Part 1:
function part1() {
  const tailPositions = new Set<string>();
  let headX = 0;
  let headY = 0;
  let tailX = 0;
  let tailY = 0;

  const moveHead = (direction: Direction) => {
    if (direction === "R") headX++;
    if (direction === "L") headX--;
    if (direction === "U") headY++;
    if (direction === "D") headY--;
  };

  const moveTail = () => {
    const diffX = headX - tailX;
    const diffY = headY - tailY;

    if (diffX === 0 && diffY === 0) return;

    // Vertical
    if (tailX === headX) {
      if (diffY < -1) tailY--;
      if (diffY > 1) tailY++;
      return;
    }
    // Horizontal
    if (tailY === headY) {
      if (diffX < -1) tailX--;
      if (diffX > 1) tailX++;
      return;
    }
    // Diagonal
    if (Math.abs(diffX) === 1) {
      if (diffY > 1) {
        tailY++;
        tailX = headX;
      }
      if (diffY < -1) {
        tailY--;
        tailX = headX;
      }
    }
    if (Math.abs(diffY) === 1) {
      if (diffX > 1) {
        tailX++;
        tailY = headY;
      }
      if (diffX < -1) {
        tailX--;
        tailY = headY;
      }
    }
  };

  moves.forEach(({ direction, value }) => {
    Array(value)
      .fill(0)
      .forEach(() => {
        moveHead(direction);
        moveTail();
        tailPositions.add(`${tailX},${tailY}`);
      });
  });

  makeGrid();

  return tailPositions.size; // 6498
}

// Part 2:
function part2() {
  return 0;
}

// Helpers

type Direction = "R" | "U" | "L" | "D";

function makeGrid(size = 2) {
  const grid: Record<number, Array<[number, number]>> = Array(size)
    .fill([[0, 0]])
    .reduce((acc, _, i) => ({ ...acc, [i]: [[0, 0]] }), {});

  const move = (direction: Direction) => {
    Object.keys(grid).forEach((key) => {
      const i = parseInt(key, 10);
      const entry = grid[i];
      const [x, y] = entry.at(-1)!;

      if (direction === "R") {
        if (i === 0) return entry.push([x + 1, y]);
      }
      if (direction === "L") {
        if (i === 0) return entry.push([x - 1, y]);
      }
      if (direction === "U") {
        if (i === 0) return entry.push([x, y + 1]);
      }
      if (direction === "D") {
        if (i === 0) return entry.push([x, y - 1]);
      }
    });
  };

  moves.forEach(({ direction, value }) => {
    Array(value)
      .fill(0)
      .forEach(() => move(direction));
  });

  return grid;
}
