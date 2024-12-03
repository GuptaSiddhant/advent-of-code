import { join } from "@std/path";

export function readInput(filename: string): string {
  const inputDir = import.meta.resolve(join("..", "inputs")).split("file:")[1];
  const inputFilename = join(inputDir, `${filename}.txt`);

  return Deno.readTextFileSync(inputFilename);
}

export function readInputLines(filename: string): string[] {
  return readInput(filename).split("\n");
}
