import { join } from "https://deno.land/std@0.202.0/path/join.ts";

export function readInput(filename: string): string {
  const cwd = Deno.cwd();
  const inputDir = join(cwd, "..", "inputs");
  const inputFilename = join(inputDir, `${filename}.txt`);

  return Deno.readTextFileSync(inputFilename);
}

export function readInputLines(filename: string): string[] {
  return readInput(filename).split("\n");
}
