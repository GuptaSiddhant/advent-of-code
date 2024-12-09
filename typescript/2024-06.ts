import {
  convertInputToGrid,
  CoordKey,
  Direction,
  findNextCoordKeyInDir,
  Grid,
  solvePart,
} from "./_utils.ts";

const year = 2024;
const day = 6;
const example = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;

solvePart(year, day, 1, part1, { input: example, result: 41 });
solvePart(year, day, 2, part2, { input: example, result: 6 });

const heads = ["^", "v", "<", ">"] as const;
type Head = (typeof heads)[number];
type Cell = "." | "#" | "O" | Head;
const dirMap = {
  "^": { nextHead: ">", dir: "TC" },
  ">": { nextHead: "v", dir: "CR" },
  v: { nextHead: "<", dir: "BC" },
  "<": { nextHead: "^", dir: "CL" },
} as const satisfies Record<Head, { nextHead: Head; dir: Direction }>;

function part1(input: string) {
  const { grid } = convertInputToGrid<Cell>(input);
  const { stepsMap } = generateStepsMap(grid);
  return stepsMap.size;
}

function part2(input: string) {
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
