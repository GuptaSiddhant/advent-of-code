import { join } from "@std/path";

export function readInput(filename: string): string {
  const inputDir = import.meta.resolve(join("..", "inputs")).split("file:")[1];
  const inputFilename = join(inputDir, `${filename}.txt`);

  return Deno.readTextFileSync(inputFilename);
}

export function readInputLines(filename: string): string[] {
  return readInput(filename).split("\n");
}

export function memoize<Args extends unknown[], Result>(
  func: (...args: Args) => Result
): (...args: Args) => Result {
  const stored = new Map<string, Result>();

  return (...args) => {
    const k = JSON.stringify(args);
    if (stored.has(k)) {
      return stored.get(k)!;
    }
    const result = func(...args);
    stored.set(k, result);
    return result;
  };
}

export type Coordinate = { x: number; y: number };
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
