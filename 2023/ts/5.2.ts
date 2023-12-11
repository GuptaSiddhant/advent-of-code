import { findSeed } from "./5.helper.ts";
import { readInput } from "./_helpers.ts";

const filename = "5.example";
const actualInput = readInput(filename);

console.log("Part 2 (Actual) :", part2(actualInput));

function part2(input: string) {
  const seedRanges =
    input
      .split("\n")[0]
      .match(/\d+\s\d+/g)
      ?.map((range) => range.split(" ").map(Number))
      .sort((a, b) => a[0] - b[0]) || [];
  console.log(seedRanges);

  let location = 0;
  let seed: number | undefined;
  do {
    const possibleSeed = findSeed(location);
    console.log(location, possibleSeed);
    const inRange = seedRanges.some(([from, length]) => {
      return possibleSeed >= from && possibleSeed < from + length;
    });
    if (inRange) seed = possibleSeed;
    else location++;
  } while (!seed);

  return location;
}
