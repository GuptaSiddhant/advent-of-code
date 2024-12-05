/**
 * Advent of code 2024 (TS) - Day 4
 * @see https://adventofcode.com/2024/day/4
 */

import { readInput } from "./_helpers.ts";

const filename = "4";
const actualInput = readInput(filename);
const exampleInput = readInput(filename + ".example");

const values = ["X", "M", "A", "S"] as const;

console.log("Part 1 (Example):", part1(exampleInput)); // 18
console.log("Part 1 (Actual) :", part1(actualInput)); // 2642
console.log("Part 2 (Example):", part2(exampleInput)); // 9
console.log("Part 2 (Actual) :", part2(actualInput)); // 1974

// Part 1:
function part1(input: string) {
  const { grid, maxX, maxY } = convertInputToGrid(input);
  const startingCoords = traverse(grid, [...grid.keys()], maxX, maxY, "X");
  const filtered = startingCoords
    .map(([key, nextKey]) =>
      getAllInDirFromCoord(grid, key, findDirFromCoord(key, nextKey))
    )
    .filter(Boolean);

  return filtered.length;
}

function part2(input: string) {
  const { grid, maxX, maxY } = convertInputToGrid(input);
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

function getAllInDirFromCoord(grid: Grid, key: CoordKey, dir: Dir) {
  const trace: CoordKey[] = [key];
  const xValue = grid.get(key);
  if (xValue === "X") {
    const mKey = findNextCoordKeyInDir(key, dir);
    trace.push(mKey);
    const mValue = grid.get(mKey);
    if (mValue === "M") {
      const aKey = findNextCoordKeyInDir(mKey, dir);
      trace.push(aKey);
      const aValue = grid.get(aKey);
      if (aValue === "A") {
        const sKey = findNextCoordKeyInDir(aKey, dir);
        trace.push(sKey);
        const sValue = grid.get(sKey);
        if (sValue === "S") {
          return trace;
        }
      }
    }
  }
  return false;
}

function traverse(
  grid: Grid,
  coordKeys: CoordKey[],
  maxX: number,
  maxY: number,
  valueToCheck: Value
) {
  const map: [CoordKey, CoordKey][] = [];
  for (const key of coordKeys) {
    const value = grid.get(key);
    if (value === valueToCheck) {
      const nextCoordKeys = findAdjacentCoordKeys(key, maxX, maxY);
      nextCoordKeys.forEach((nextKey) => {
        map.push([key, nextKey]);
      });
    }
  }
  return map;
}

function findAdjacentCoordKeys(
  key: CoordKey,
  maxX: number,
  maxY: number
): CoordKey[] {
  const { x, y } = parseCoordKey(key);

  const coordsSet = new Set<CoordKey>();
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      const newX = Math.min(Math.max(i, 0), maxX);
      const newY = Math.min(Math.max(j, 0), maxY);
      const newKey = createCoordKey(newX, newY);
      if (newKey !== key) {
        coordsSet.add(newKey);
      }
    }
  }

  return Array.from(coordsSet);
}

function findNextCoordKeyInDir(key: CoordKey, dir: Dir): CoordKey {
  const { x, y } = parseCoordKey(key);
  switch (dir) {
    case "TL":
      return createCoordKey(x - 1, y - 1);
    case "TC":
      return createCoordKey(x - 1, y);
    case "TR":
      return createCoordKey(x - 1, y + 1);
    case "CL":
      return createCoordKey(x, y - 1);
    case "CR":
      return createCoordKey(x, y + 1);
    case "BL":
      return createCoordKey(x + 1, y - 1);
    case "BC":
      return createCoordKey(x + 1, y);
    case "BR":
      return createCoordKey(x + 1, y + 1);
    default:
      throw new Error("Undefined direction:", dir);
  }
}

function findDirFromCoord(key: CoordKey, newKey: CoordKey): Dir {
  const { x, y } = parseCoordKey(key);
  const { x: x2, y: y2 } = parseCoordKey(newKey);

  let P1 = "";
  let P2 = "";
  if (x2 === x - 1) {
    P1 = "T";
  }
  if (x2 === x) {
    P1 = "C";
  }
  if (x2 === x + 1) {
    P1 = "B";
  }
  if (y2 === y - 1) {
    P2 = "L";
  }
  if (y2 === y) {
    P2 = "C";
  }
  if (y2 === y + 1) {
    P2 = "R";
  }
  return `${P1}${P2}` as Dir;
}

function convertInputToGrid(str: string): {
  grid: Grid;
  maxX: number;
  maxY: number;
} {
  const grid: Grid = new Map<CoordKey, Value>();
  let maxX = 0;
  let maxY = 0;

  str.split("\n").forEach((row, x) => {
    row.split("").forEach((cell, y) => {
      grid.set(createCoordKey(x, y), cell as Value);
      if (y > maxY) {
        maxY = y;
      }
    });
    if (x > maxX) {
      maxX = x;
    }
  });

  return { grid, maxX, maxY };
}

function createCoordKey(x: number, y: number): CoordKey {
  return `${x}-${y}`;
}
function parseCoordKey(key: CoordKey): Coord {
  const [x, y] = key.split("-").map(Number);
  return { x, y };
}

type Grid = Map<CoordKey, Value>;
type Value = (typeof values)[number];
type CoordKey = `${number}-${number}`;
type Coord = { x: number; y: number };
type Dir = "TL" | "TC" | "TR" | "CL" | "CR" | "BL" | "BC" | "BR";
