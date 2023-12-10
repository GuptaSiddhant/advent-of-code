import { readInput } from "./_helpers.ts";

const filename = "10";
const actualInput = readInput(filename);
const example1Input = readInput(filename + ".example1");
const example2Input = readInput(filename + ".example2");
const example3Input = readInput(filename + ".example3");
const example4Input = readInput(filename + ".example4");
const example5Input = readInput(filename + ".example5");

const pipes = {
  "|": ["N", "S"],
  "-": ["E", "W"],
  L: ["N", "E"],
  J: ["N", "W"],
  "7": ["S", "W"],
  F: ["S", "E"],
};
enum Dir {
  E = "E",
  S = "S",
  W = "W",
  N = "N",
}

// console.log("Part 1 (Example1):", part1(example1Input));
// console.log("Part 1 (Example2):", part1(example2Input));
// console.log("Part 1 (Actual)  :", part1(actualInput));

// console.log("Part 2 (Example3):", part2(example3Input));
// console.log("Part 2 (Example4):", part2(example4Input));
// console.log("Part 2 (Example5):", part2(example5Input));
console.log("Part 2 (Actual)  :", part2(actualInput));

function part1(input: string) {
  const { grid, start } = parseInputToGrid(input);
  const loop = buildLoop(grid, start);

  return Math.floor(loop.length / 2);
}

function part2(input: string) {
  console.time("p2");
  const { grid, start, maxX, maxY } = parseInputToGrid(input);
  const loop = buildLoop(grid, start);
  const clockwise = checkLoopClockwise(loop);

  const contained: Coordinate[] = findTileNotInLoop(grid, loop)
    .map((coord) => {
      console.timeLog("p2", coord);
      const left = checkNextTileInLoop(coord, loop, Dir.W, maxX, maxY);
      const bottom = checkNextTileInLoop(coord, loop, Dir.S, maxX, maxY);
      const right = checkNextTileInLoop(coord, loop, Dir.E, maxX, maxY);
      const top = checkNextTileInLoop(coord, loop, Dir.N, maxX, maxY);

      if (!top || !bottom || !left || !right) return undefined;
      if (checkEnclosed(top, bottom, left, right, clockwise)) return coord;
      return undefined;
    })
    .filter(Boolean) as Coordinate[];

  console.timeEnd("p2");
  return contained.length;
}

// Helpers

function findTileNotInLoop(grid: Grid, loop: Path[]) {
  const tiles: Coordinate[] = [];
  grid.forEach((line, y) => {
    line.forEach((_, x) => {
      if (loop.some((path) => path.coord.x === x && path.coord.y === y)) return;
      const coord: Coordinate = { x, y };
      tiles.push(coord);
    });
  });

  return tiles;
}

function checkEnclosed(
  top: Path,
  bottom: Path,
  left: Path,
  right: Path,
  clockwise: boolean
): boolean {
  const min = Math.min(top.count, bottom.count, left.count, right.count);
  const flow = clockwise
    ? [top, right, bottom, left]
    : [top, left, bottom, right];
  const minDir = flow.findIndex((path) => path.count === min)!;
  const newFlow = flow.slice(minDir).concat(flow.slice(0, minDir));

  return (
    newFlow[0].count < newFlow[1].count &&
    newFlow[1].count < newFlow[2].count &&
    newFlow[2].count < newFlow[3].count
  );
}

function checkNextTileInLoop(
  coord: Coordinate,
  loop: Path[],
  dir: Dir,
  maxX: number,
  maxY: number
): Path | undefined {
  const nextCoord = findNextCoordTo(dir, coord);
  if (
    nextCoord.x < 0 ||
    nextCoord.y < 0 ||
    nextCoord.x >= maxX ||
    nextCoord.y >= maxY
  )
    return undefined;

  const path = loop.find(
    (path) => path.coord.x === nextCoord.x && path.coord.y === nextCoord.y
  );
  if (path) return path;
  else return checkNextTileInLoop(nextCoord, loop, dir, maxX, maxY);
}

function buildLoop(grid: Grid, start: Coordinate) {
  let path = findPath(grid, start);
  const loop: Path[] = [
    { coord: start, count: 0, pipeKey: "S", to: invertDir(path.to) },
    path,
  ];
  do {
    path = followPipe(grid, path);
    loop.push(path);
  } while (path.pipeKey !== "S");

  return loop;
}

function checkLoopClockwise(loop: Path[]) {
  const first = loop[0];
  return first.to === Dir.W || first.to === Dir.S;
}

type PipeKey = keyof typeof pipes;
type Grid = Array<Array<PipeKey | "S" | ".">>;
type Path = {
  coord: Coordinate;
  to: Dir | undefined;
  pipeKey: PipeKey | "S";
  count: number;
};
type Coordinate = { x: number; y: number };

function parseInputToGrid(input: string) {
  const grid: Grid = [];
  let start: Coordinate;

  const lines = input.split("\n");
  lines.forEach((line, y) => {
    if (!grid[y]) grid[y] = [];

    line.split("").forEach((char, x) => {
      const coord: Coordinate = { y, x };
      grid[y][x] = char as PipeKey | "S" | ".";
      if (char === "S") start = coord;
    });
  });

  const maxY = lines.length;
  const maxX = lines[0].length;

  return { grid, start: start!, maxX, maxY };
}

function findPath(grid: Grid, coord: Coordinate): Path {
  const dirs = Object.values(Dir);
  let path: Path | undefined = undefined;
  for (const from of dirs) {
    const nextCoord = findNextCoordFrom(from, coord);
    const pipeKey = grid[nextCoord.y][nextCoord.x];
    if (!pipeKey || pipeKey === "S" || pipeKey === ".") continue;
    if (pipes[pipeKey].includes(from)) {
      const to = pipes[pipeKey].find((dir) => dir !== from)! as Dir;
      path = { coord: nextCoord, to, pipeKey, count: 1 } satisfies Path;
      break;
    }
  }

  return path as Path;
}

function findNextCoordFrom(from: Dir | undefined, coord: Coordinate) {
  return findNextCoordTo(invertDir(from), coord);
}
function findNextCoordTo(to: Dir | undefined, coord: Coordinate) {
  if (to === Dir.N) return { ...coord, y: coord.y - 1 };
  if (to === Dir.S) return { ...coord, y: coord.y + 1 };
  if (to === Dir.E) return { ...coord, x: coord.x + 1 };
  if (to === Dir.W) return { ...coord, x: coord.x - 1 };
  throw new Error("Invalid direction");
}

function followPipe(grid: Grid, path: Path): Path {
  const { coord, to, count } = path;
  if (!to) return path;
  const nextCoord = findNextCoordTo(to, coord);
  const pipeKey = grid[nextCoord.y][nextCoord.x];

  if (!pipeKey || pipeKey === ".") throw new Error("Invalid path");
  if (pipeKey === "S")
    return { coord: nextCoord, to: undefined, pipeKey: "S", count: count + 1 };

  const nextTo = pipes[pipeKey].find((dir) => dir !== invertDir(to))! as Dir;
  return { coord: nextCoord, to: nextTo, pipeKey, count: count + 1 };
}

function invertDir(dir: Dir | undefined) {
  if (dir === Dir.N) return Dir.S;
  if (dir === Dir.S) return Dir.N;
  if (dir === Dir.E) return Dir.W;
  if (dir === Dir.W) return Dir.E;
  throw new Error("Invalid direction");
}
