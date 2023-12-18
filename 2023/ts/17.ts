/** @see https://adventofcode.com/2023/day/17 */

import { readInput } from "./_helpers.ts";

const filename = "17";
const actualInput = readInput(filename);
const exampleInput = readInput(filename + ".example");

const directions = ["up", "down", "left", "right"] as const;

console.log("Part 1 (Example):", part1(exampleInput)); // 102
// console.log("Part 1 (Actual) :", part1(actualInput)); // 1065
console.log("Part 2 (Example):", part2(exampleInput)); // 51
// console.log("Part 2 (Actual) :", part2(actualInput)); // 7513

function part1(input: string) {
  const grid: Grid = input.split("\n").map((line) => line.split(""));
  const path = findPath(
    grid,
    { y: 0, x: 1, direction: "right" },
    { y: grid.length - 1, x: grid[0].length - 1 },
    3,
    1
  );
  console.log(path);
  return path.reduce((sum, a) => sum + (a.heatLoss || 0), 0);
}

function part2(input: string) {
  const grid: Grid = input.split("\n").map((line) => line.split(""));
  const path = findPath(
    grid,
    { y: 0, x: 1, direction: "right" },
    { y: grid.length - 1, x: grid[0].length - 1 },
    10,
    4
  );
  console.log(path);
  return path.reduce((sum, a) => sum + (a.heatLoss || 0), 0);
}

//

type Grid = string[][];
type Direction = (typeof directions)[number];
type Coordinate = { x: number; y: number };
type Step = Coordinate & { direction: Direction; heatLoss?: number };
type Path = Step[];

function findPath(
  grid: Grid,
  start: Step,
  end: Coordinate,
  maxCount: number,
  minSteps: number
): Path {
  const path: Path = [];
  let current: Step = start;
  let count = 0;

  do {
    const newSteps = findLeastHeatLossStep(
      grid,
      current,
      count,
      maxCount,
      minSteps
    );
    newSteps.forEach((step) => path.push(step));

    if (newSteps[0].direction === current.direction) count += minSteps;
    else count = 0;

    current = newSteps[newSteps.length - 1];
  } while (current.x !== end.x && current.y !== end.y);

  return path;
}

function findLeastHeatLossStep(
  grid: Grid,
  step: Step,
  stepCount: number,
  maxCount: number,
  minStepsCount: number
): Step[] {
  const possibleDirections = directions.filter((d) => {
    if (d === invertDirection(step.direction)) return false;
    if (stepCount > maxCount - 1 && d === step.direction) return false;
    return d !== "left";
  });

  const possibleSteps = possibleDirections.map((dir) => {
    const steps: Step[] = [];
    for (let i = 0; i < minStepsCount; i++) {
      const nextStep = findNextStep({ ...step, direction: dir });
      const heatLoss = grid[nextStep.y]?.[nextStep.x];
      if (!heatLoss) return undefined;
      steps.push({ ...nextStep, direction: dir, heatLoss: Number(heatLoss) });
    }
    return steps.filter(Boolean);
  });

  let minLoss = Number.POSITIVE_INFINITY;
  let minSteps: Step[] = [];
  possibleSteps.forEach((steps) => {
    if (!steps) return;
    const heat = steps.reduce((sum, a) => sum + (a.heatLoss || 0), 0);
    if (heat < minLoss) {
      minLoss = heat;
      minSteps = steps;
    }
  });

  return minSteps;
}

function findNextStep(step: Step): Coordinate {
  const { x, y, direction } = step;
  if (direction === "right") return { y, x: x + 1 };
  if (direction === "left") return { y, x: x - 1 };
  if (direction === "up") return { y: y - 1, x };
  if (direction === "down") return { y: y + 1, x };
  throw new Error("Invalid direction");
}

function invertDirection(dir: Direction): Direction {
  if (dir === "down") return "up";
  if (dir === "left") return "right";
  if (dir === "right") return "left";
  if (dir === "up") return "down";
  throw new Error("Invalid direction");
}

/**
2>>34^>>>1323
32v>>>35v5623
32552456v>>54
3446585845v52
4546657867v>6
14385987984v4
44578769877v6
36378779796v>
465496798688v
456467998645v
12246868655<v
25465488877v5
43226746555v>
 */
