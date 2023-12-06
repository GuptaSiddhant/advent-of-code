import { join } from "https://deno.land/std@0.202.0/path/join.ts";

function readInput(filename: string): string {
  const cwd = Deno.cwd();
  const inputDir = join(cwd, "..", "inputs");
  const inputFilename = join(inputDir, `${filename}.txt`);

  return Deno.readTextFileSync(inputFilename);
}

const mapNames = [
  "seed-to-soil",
  "soil-to-fertilizer",
  "fertilizer-to-water",
  "water-to-light",
  "light-to-temperature",
  "temperature-to-humidity",
  "humidity-to-location",
];
const rangeMap = new Map<string, number[][]>();
mapNames.forEach((name) => {
  const ranges = parseMapLines(readInput("5"), name)
    .map((range) => range.split(" ").map(Number))
    .sort((a, b) => a[1] - b[1]);

  rangeMap.set(name, ranges);
});

function parseMapLines(input: string, name: string) {
  return input.split(`${name} map:\n`)[1].split("\n\n")[0].split("\n");
}

function getMappedValueFromSet(ranges: number[][], from: number): number {
  let to = from;
  for (const [dest, source, length] of ranges) {
    if (from >= source && from <= source + length) {
      to = dest + (from - source);
      break;
    }
  }

  return to;
}

export function findLocation(seed: number) {
  let value = seed;

  mapNames.forEach((name) => {
    value = getMappedValueFromSet(rangeMap.get(name)!, value);
  });

  return value;
}
