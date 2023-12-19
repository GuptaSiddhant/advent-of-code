/** @see https://adventofcode.com/2023/day/19 */

import { readInput } from "./_helpers.ts";
import {
  parseInput,
  checkIfPartAccepted,
  type Part,
  type WorkflowMap,
} from "./19.helper.ts";

const filename = "19";
const actualInput = readInput(filename);
const exampleInput = readInput(filename + ".example");

// console.log("Part 1 (Example):", part1(exampleInput)); // 19114
// console.log("Part 1 (Actual) :", part1(actualInput)); // 362930
console.log("Part 2 (Example):", await part2(exampleInput)); // 167_409_079_868_000
// console.log("Part 2 (Actual) :", part2(actualInput)); //

function part1(input: string) {
  const { parts, workflows } = parseInput(input);
  const acceptedParts = parts.filter((part) =>
    checkIfPartAccepted(part, workflows, "in")
  );
  return acceptedParts.reduce(
    (sum, part) => sum + part.x + part.m + part.a + part.s,
    0
  );
}

async function part2(input: string) {
  console.time("Main");
  const { workflows } = parseInput(input);
  const min = 1;
  const max = 4000;

  const CORE_COUNT = 10;
  const INCREMENT = 100;
  const promiseSet: { min: number; max: number }[][] = [];
  for (
    let i = min, cc = 0;
    i <= max;
    i += INCREMENT, cc = (cc + 1) % CORE_COUNT
  ) {
    const set = { min: i, max: Math.min(max, i + INCREMENT) };
    if (!promiseSet[cc]) promiseSet[cc] = [];
    promiseSet[cc].push(set);
  }

  let accepted = 0;

  for (let i = 0; i < promiseSet[0].length; i++) {
    const sets = promiseSet.map((set) => set[i]);
    const promises = sets.map(({ min, max }) => {
      const minPart = { x: min, m: min, a: min, s: min };
      const maxPart = { x: max, m: max, a: max, s: max };
      return callWorker({ minPart, maxPart, workflows });
    });
    const results = await Promise.all(promises);
    accepted += results.reduce((acc, a) => acc + a, 0);
    console.timeLog("Main", ((i / promiseSet[0].length) * 100).toPrecision(2));
  }

  console.timeEnd("Main");
  return accepted;
}

function callWorker(message: {
  minPart: Part;
  maxPart: Part;
  workflows: WorkflowMap;
}) {
  const workerPath = new URL("./19.worker.ts", import.meta.url).href;
  const worker = new Worker(workerPath, { type: "module" });
  worker.postMessage(message);
  return new Promise<number>((resolve) => {
    worker.addEventListener("message", (event: any) => resolve(event.data));
  });
}
