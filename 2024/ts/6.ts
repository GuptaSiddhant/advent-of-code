/**
 * Advent of code 2024 (TS) - Day 6
 * @see https://adventofcode.com/2024/day/6
 */

import type { CoordKey, Direction, Grid } from "./_helpers.ts";
import { findNextCoordKeyInDir } from "./_helpers.ts";
import { readInput, convertInputToGrid } from "./_helpers.ts";

const filename = "6";
const actualInput = readInput(filename);
const exampleInput = readInput(filename + ".example");

const heads = ["^", "v", "<", ">"] as const;
type Head = (typeof heads)[number];
type Cell = "." | "#" | "O" | Head;
const dirMap = {
  "^": { nextHead: ">", dir: "TC" },
  ">": { nextHead: "v", dir: "CR" },
  v: { nextHead: "<", dir: "BC" },
  "<": { nextHead: "^", dir: "CL" },
} as const satisfies Record<Head, { nextHead: Head; dir: Direction }>;

// console.log("Part 1 (Example):", part1(exampleInput)); // 41
// console.log("Part 1 (Actual) :", part1(actualInput)); // 4964
console.log("Part 2 (Example):", part2_brute(exampleInput)); // 6
// console.log("Part 2 (Actual) :", part2_brute(actualInput)); // 1740

// Part 1:
function part1(input: string) {
  const { grid } = convertInputToGrid<Cell>(input);
  const { stepsMap } = generateStepsMap(grid);
  return stepsMap.size;
}

// Part 2:
function part2_attempt(input: string) {
  const { grid } = convertInputToGrid<Cell>(input);

  const testGrid = new Map(grid);
  const { stepsMap } = generateStepsMap(testGrid);
  const keysWithPlus1Step = Array.from(
    stepsMap.entries().filter(([, value]) => value.length > 1)
  );
  const possibleObstacles: CoordKey[] = keysWithPlus1Step
    .map(([key, values]) => {
      const heads = values.slice(1);
      return heads.map((head) => {
        const { dir } = dirMap[head];
        return findNextCoordKeyInDir(key, dir);
      });
    })
    .flat();
  console.log(keysWithPlus1Step, possibleObstacles);

  let loopers = 0;
  for (const obsKey of possibleObstacles) {
    const newGrid = new Map(grid);
    newGrid.set(obsKey, "O");
    const { looped } = generateStepsMap(newGrid, obsKey);
    if (looped) loopers++;
  }

  return loopers;
}

function part2_brute(input: string) {
  const { grid } = convertInputToGrid<Cell>(input);
  let loopers = 0;

  grid
    .entries()
    .filter(([, cell]) => cell === ".")
    .map(([key]) => {
      const newGrid = new Map(grid);
      newGrid.set(key, "O");
      return newGrid;
    })
    .forEach((gridWithO) => {
      const { looped } = generateStepsMap(gridWithO);
      if (looped) loopers++;
    });

  return loopers;
}

function generateStepsMap(grid: Grid<Cell>, debug: unknown = false) {
  const stepsMap = new Map<CoordKey, Head[]>();

  let currentCellKey = grid
    .entries()
    .find(([, cell]) => heads.includes(cell as Head))?.[0];
  let looped = false;

  while (currentCellKey) {
    const currentCellValue = grid.get(currentCellKey);
    if (!currentCellValue) {
      break;
    }

    const head = currentCellValue as Head;
    if (heads.includes(head)) {
      if (stepsMap.has(currentCellKey)) {
        const steps = stepsMap.get(currentCellKey)!;
        if (steps.includes(head)) {
          if (debug) {
            console.log("----------", debug);
          }
          looped = true;
          break;
        }
        stepsMap.set(currentCellKey, [...steps, head]);
      } else {
        stepsMap.set(currentCellKey, [head]);
      }
      const { dir, nextHead } = dirMap[head];
      const nextCellKey = findNextCoordKeyInDir(currentCellKey, dir);
      const nextCellValue = grid.get(nextCellKey);
      if (!nextCellValue) {
        currentCellKey = undefined;
        break;
      }
      if (nextCellValue === "#" || nextCellValue === "O") {
        grid.set(currentCellKey, nextHead);
      } else {
        grid.set(currentCellKey, ".");
        grid.set(nextCellKey, head);
        currentCellKey = nextCellKey;
      }
    }
  }

  return { stepsMap, looped };
}
