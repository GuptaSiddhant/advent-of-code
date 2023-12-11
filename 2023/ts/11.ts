import { readInput } from "./_helpers.ts";

const filename = "11";
const actualInput = readInput(filename);
const exampleInput = readInput(filename + ".example");

// console.log("Part 1 (Example):", main(exampleInput, 2));
// console.log("Part 1 (Actual) :", main(actualInput, 2));

const MILLION = 1_000_000;
console.log("Part 2 (Example):", main(exampleInput, MILLION));
console.log("Part 2 (Actual) :", main(actualInput, MILLION));

function main(input: string, expand: number) {
  const { grid, emptyCols, emptyRows, count } = parseInputToGrid(input);
  const map = genMap(grid);
  const pairs = genPairs(count);
  const distances = pairs.map(([a, b]) =>
    getDistance(map.get(a)!, map.get(b)!, emptyCols, emptyRows, expand)
  );

  return distances.reduce((a, b) => a + b, 0);
}

// Helpers
type Coordinate = { x: number; y: number };

function getDistance(
  a: Coordinate,
  b: Coordinate,
  emptyCols: number[],
  emptyRows: number[],
  expand: number
) {
  const { x: x1, y: y1 } = a;
  const { x: x2, y: y2 } = b;

  const emptyColsBetween = emptyCols.filter(
    (x) => (x > x1 && x < x2) || (x < x1 && x > x2)
  ).length;
  const xDistance = Math.abs(x1 - x2) + emptyColsBetween * (expand - 1);

  const emptyRowsBetween = emptyRows.filter(
    (y) => (y > y1 && y < y2) || (y < y1 && y > y2)
  ).length;
  const yDistance = Math.abs(y1 - y2) + emptyRowsBetween * (expand - 1);

  return xDistance + yDistance;
}

function genPairs(count: number) {
  const pairs: [number, number][] = [];
  for (let i = 1; i <= count; i++) {
    for (let j = 1; j <= count; j++) {
      if (i === j) continue;
      if (!pairs.find(([a, b]) => (a === i && b === j) || (a === j && b === i)))
        pairs.push([i, j]);
    }
  }

  return pairs;
}

function genMap(grid: (number | ".")[][]) {
  const map = new Map<number, Coordinate>();
  grid.forEach((line, y) => {
    line.forEach((t, x) => {
      if (t !== ".") map.set(t, { x, y });
    });
  });

  return map;
}

function parseInputToGrid(input: string) {
  let count = 0;
  const emptyCols: number[] = [];
  const emptyRows: number[] = [];

  const grid = input.split("\n").map((line, y) => {
    const lineArr = line.split("");
    if (lineArr.every((t) => t === ".")) emptyRows.push(y);
    return lineArr.map((t) => (t === "." ? "." : ++count));
  });

  for (let x = 0; x < grid[0].length; x++) {
    const column = grid.map((line) => line[x]);
    if (column.every((t) => t === ".")) emptyCols.push(x);
  }

  return { grid, emptyCols, emptyRows, count };
}
