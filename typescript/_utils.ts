import { assertEquals } from "jsr:@std/assert";
import { resolve } from "jsr:@std/path";

export function generateInputFilename(
  year: number | string,
  day: number | string
) {
  return `${year}-${day.toString().padStart(2, "0")}`;
}

export function readInputFileText(year: number, day: number) {
  return Deno.readTextFileSync(
    resolve(
      import.meta.dirname ?? "",
      "..",
      "inputs",
      `${generateInputFilename(year, day)}.txt`
    )
  );
}

export function solvePart<R>(
  year: number,
  day: number,
  part: 1 | 2,
  solutionFn: (input: string) => NoInfer<R>,
  ...examples: { input: string; result: R }[]
) {
  Deno.test(`${generateInputFilename(year, day)} Part ${part}`, () => {
    for (const example of examples) {
      assertEquals(solutionFn(example.input), example.result);
    }

    try {
      const result = solutionFn(readInputFileText(year, day));
      console.log(result);
    } catch (error) {
      console.error(
        `%cError occurred while solving actual puzzle input.`,
        "color:red;"
      );
      throw error;
    }
  });
}

export function pathToGrid(cords: Coordinate[]) {
  const allY = cords.map((c) => c.y);
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);
  const allX = cords.map((c) => c.x);
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);

  const grid: string[][] = [];
  for (let y = minY; y <= maxY; y++) {
    let line = "";
    for (let x = minX; x <= maxX; x++) {
      const c = cords.find((c) => c.x === x && c.y === y);
      line += c ? "#" : ".";
    }
    grid.push(line.split(""));
  }

  return grid;
}

export type Coordinate = { x: number; y: number };
export type Grid<Value> = Map<CoordKey, Value>;
export type CoordKey = `${number}-${number}`;
export type Direction = "TL" | "TC" | "TR" | "CL" | "CR" | "BL" | "BC" | "BR";

export function getAllInDirFromCoord<Value = string>(
  grid: Grid<Value>,
  key: CoordKey,
  dir: Direction
) {
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

export function traverseGrid<Value = string>(
  grid: Grid<Value>,
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

export function findAdjacentCoordKeys(
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

export function findNextCoordKeyInDir(key: CoordKey, dir: Direction): CoordKey {
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

export function findDirFromCoord(key: CoordKey, newKey: CoordKey): Direction {
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
  return `${P1}${P2}` as Direction;
}

export function convertInputToGrid<Value>(
  str: string,
  separator = ""
): {
  grid: Grid<Value>;
  maxX: number;
  maxY: number;
} {
  const grid: Grid<Value> = new Map<CoordKey, Value>();
  let maxX = 0;
  let maxY = 0;

  str.split("\n").forEach((row, x) => {
    row.split(separator).forEach((cell, y) => {
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

export function createCoordKey(x: number, y: number): CoordKey {
  return `${x}-${y}`;
}

export function parseCoordKey(key: CoordKey): Coordinate {
  const [x, y] = key.split("-").map(Number);
  return { x, y };
}

export function drawGrid(grid: Grid<unknown>) {
  const draw: unknown[][] = [];

  grid.entries().forEach(([key, value]) => {
    const { x, y } = parseCoordKey(key);
    if (!draw[x]) {
      draw[x] = [];
    }

    draw[x][y] = value;
  });

  draw.forEach((row) => console.log(row.join("")));

  return draw;
}

export function getPermutations<T>(inputArr: T[]) {
  const result: T[][] = [];

  const permute = (arr: T[], m: T[] = []) => {
    if (arr.length === 0) {
      result.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        const curr = arr.slice();
        const next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next));
      }
    }
  };

  permute(inputArr);

  return result;
}

export function getCombinations<T>(valuesArray: T[]) {
  const combinations: T[][] = [];
  let temp = [];
  const sLength = Math.pow(2, valuesArray.length);

  for (let i = 0; i < sLength; i++) {
    temp = [];
    for (let j = 0; j < valuesArray.length; j++) {
      if (i & Math.pow(2, j)) {
        temp.push(valuesArray[j]);
      }
    }
    if (temp.length > 0) {
      combinations.push(temp);
    }
  }

  combinations.sort((a, b) => a.length - b.length);
  return combinations;
}

export function generateCombinations<T>(
  values: Readonly<[T, ...T[]]>,
  count: number
): T[][] {
  function LoopIt(
    depth: number,
    baseString: string,
    arrLetters: Readonly<[T, ...T[]]>
  ) {
    let returnValue = "";
    for (let i = 0; i < arrLetters.length; i++) {
      returnValue +=
        depth == 1
          ? "," + baseString + arrLetters[i]
          : LoopIt(depth - 1, baseString + arrLetters[i], arrLetters);
    }
    return returnValue;
  }
  return LoopIt(count, "", values)
    .split(",")
    .filter(Boolean)
    .map((c) => c.split("") as T[]);
}
