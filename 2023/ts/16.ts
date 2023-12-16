/** @see https://adventofcode.com/2023/day/16 */

import { readInput } from "./_helpers.ts";

const filename = "16";
const actualInput = readInput(filename);
const exampleInput = readInput(filename + ".example");

console.log("Part 1 (Example):", part1(exampleInput)); // 46
console.log("Part 1 (Actual) :", part1(actualInput)); // 6855
console.log("Part 2 (Example):", part2(exampleInput)); // 51
console.log("Part 2 (Actual) :", part2(actualInput)); // 7513

function part1(input: string) {
  const grid: Grid = input.split("\n").map((line) => line.split(""));
  return calcEnergyTiles(grid, { y: 0, x: -1, direction: "right" });
}

function part2(input: string) {
  const grid: Grid = input.split("\n").map((line) => line.split(""));
  const rows = grid.length;
  const cols = grid[0].length;

  let maxTiles = 0;

  for (let y = 0; y < rows; y++) {
    const a = calcEnergyTiles(grid, { y, x: -1, direction: "right" });
    const b = calcEnergyTiles(grid, { y, x: cols, direction: "left" });
    maxTiles = Math.max(maxTiles, a, b);
  }

  for (let x = 0; x < cols; x++) {
    const a = calcEnergyTiles(grid, { x, y: -1, direction: "down" });
    const b = calcEnergyTiles(grid, { x, y: rows, direction: "up" });
    maxTiles = Math.max(maxTiles, a, b);
  }

  return maxTiles;
}

//

type Grid = string[][];
type Tile = "." | "/" | "\\" | "|" | "-";
type Direction = "up" | "down" | "left" | "right";
type Coordinate = { x: number; y: number };
type BeamStep = Coordinate & { direction: Direction };
type Beam = BeamStep[];

function calcEnergyTiles(grid: Grid, initStep: BeamStep) {
  const energyTiles = new Set<string>();
  const beams: BeamStep[][] = [];
  beams.push([initStep]);

  for (const beam of beams) {
    let i = 0;
    while (true) {
      const beamStep = beam[i];
      const nextTile = findNextTile(beamStep);
      const tile = grid[nextTile.y]?.[nextTile.x] as Tile | undefined;
      if (!tile) break;
      energyTiles.add(`${nextTile.y},${nextTile.x}`);
      const newBeamsStep = actTile(beamStep, nextTile, tile);
      i++;
      if (newBeamsStep.length === 0) break;
      newBeamsStep.slice(1).forEach((step) => {
        if (checkUniqueBeam(beams, step)) beams.push([step]);
      });
      if (checkUniqueBeamStep(beam, newBeamsStep[0])) {
        beam.push(newBeamsStep[0]);
      } else {
        break;
      }
    }
  }

  return energyTiles.size;
}

function checkUniqueBeam(beams: Beam[], step: BeamStep) {
  return (
    beams.findIndex(
      (b) =>
        b[0].x === step.x &&
        b[0].y === step.y &&
        b[0].direction === step.direction
    ) === -1
  );
}

function checkUniqueBeamStep(beam: Beam, step: BeamStep) {
  return (
    beam.findIndex(
      ({ x, direction, y }) =>
        x === step.x && y === step.y && direction === step.direction
    ) === -1
  );
}

function findNextTile(step: BeamStep): Coordinate {
  const { x, y, direction } = step;
  if (direction === "right") return { y, x: x + 1 };
  if (direction === "left") return { y, x: x - 1 };
  if (direction === "up") return { y: y - 1, x };
  if (direction === "down") return { y: y + 1, x };
  throw new Error("Invalid direction");
}

function actTile(step: BeamStep, nextTile: Coordinate, tile: Tile): BeamStep[] {
  const newBeam = { y: nextTile.y, x: nextTile.x, direction: step.direction };

  switch (tile) {
    case ".": {
      return [newBeam];
    }

    case "/": {
      switch (step.direction) {
        case "right": {
          newBeam.direction = "up";
          break;
        }
        case "left": {
          newBeam.direction = "down";
          break;
        }
        case "down": {
          newBeam.direction = "left";
          break;
        }
        case "up": {
          newBeam.direction = "right";
          break;
        }
      }
      return [newBeam];
    }

    case "\\": {
      switch (step.direction) {
        case "right": {
          newBeam.direction = "down";
          break;
        }
        case "left": {
          newBeam.direction = "up";
          break;
        }
        case "down": {
          newBeam.direction = "right";
          break;
        }
        case "up": {
          newBeam.direction = "left";
          break;
        }
      }
      return [newBeam];
    }

    case "|": {
      if (step.direction === "up" || step.direction === "down")
        return [newBeam];
      return [
        { ...newBeam, direction: "up" },
        { ...newBeam, direction: "down" },
      ];
    }
    case "-": {
      if (step.direction === "left" || step.direction === "right")
        return [newBeam];
      return [
        { ...newBeam, direction: "left" },
        { ...newBeam, direction: "right" },
      ];
    }

    default: {
      throw new Error("Invalid tile");
    }
  }
}
