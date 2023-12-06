import { readInput } from "./_helpers.ts";

const filename = "5";
const actualInput = readInput(filename);

console.log("Part 2 (Actual) :", await part2(actualInput));

async function part2(input: string) {
  console.time("Main");
  const seedRanges =
    input
      .split("\n")[0]
      .match(/\d+\s\d+/g)
      ?.map((range) => range.split(" ").map(Number))
      .sort((a, b) => a[0] - b[0]) || [];

  const totalSeeds = seedRanges.reduce((acc, a) => acc + a[1], 0);

  const MAX_LENGTH = 1_000_000;
  const newRanges = seedRanges.flatMap(([from, length]) => {
    const ranges = [];
    for (let i = 0; i < length; i += MAX_LENGTH) {
      ranges.push([from + i, Math.min(MAX_LENGTH, length - i)]);
    }
    return ranges;
  });

  const CORE_COUNT = 10;
  const promiseSet: number[][][] = [];
  for (let i = 0; i < newRanges.length; i += CORE_COUNT) {
    const set = newRanges.slice(i, i + CORE_COUNT);
    promiseSet.push(set);
  }

  let min = Number.POSITIVE_INFINITY;
  let remaining = totalSeeds;
  for (const set of promiseSet) {
    const setLength = set.reduce((acc, a) => acc + a[1], 0);
    const promises = set.map(([from, length], index) =>
      callWorker(from, length, index, min)
    );

    const locations = await Promise.all(promises);
    min = Math.min(...locations);

    remaining -= setLength;
    console.timeLog(
      "Main",
      ((1 - remaining / totalSeeds) * 100).toPrecision(2),
      "%"
    );
  }

  console.timeEnd("Main");
  return min;
}

function callWorker(from: number, length: number, index: number, min: number) {
  const workerPath = new URL("./5.worker.ts", import.meta.url).href;
  const worker = new Worker(workerPath, { type: "module" });
  worker.postMessage({ from, length, index, min });
  return new Promise<number>((resolve) => {
    worker.addEventListener("message", (event: any) => resolve(event.data));
  });
}
