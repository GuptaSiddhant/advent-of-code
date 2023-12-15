/** @see https://adventofcode.com/2023/day/15 */

import { readInput } from "./_helpers.ts";

const filename = "15";
const actualInput = readInput(filename);
const exampleInput = readInput(filename + ".example");

console.log("Part 1 (Example):", part1(exampleInput)); // 1320
console.log("Part 1 (Actual) :", part1(actualInput)); // 519603
console.log("Part 2 (Example):", part2(exampleInput)); // 145
console.log("Part 2 (Actual) :", part2(actualInput)); // 244342

function part1(input: string) {
  return input
    .split(",")
    .reduce((sum, instruction) => sum + calcHash(instruction), 0);
}

function part2(input: string) {
  const ins = input.split(",").map((entry) => {
    if (entry.includes("-")) {
      const label = entry.split("-")[0];
      return { label, mode: "-", box: calcHash(label), value: 0, entry };
    }
    const [label, value] = entry.split("=");
    const box = calcHash(label);
    return { label, mode: "=", box, value: Number(value), entry };
  });

  const hashmap = new Map<number, Map<string, number>>();

  ins.forEach(({ box, label, mode, value }) => {
    const boxMap = hashmap.get(box) || new Map<string, number>();
    if (mode === "=") boxMap.set(label, value);
    if (mode === "-") boxMap.delete(label);

    if (boxMap.size === 0) hashmap.delete(box);
    else hashmap.set(box, boxMap);
  });

  let power = 0;
  Array.from(hashmap.keys()).forEach((box) => {
    const boxMap = hashmap.get(box)!;
    const boxN = box + 1;
    Array.from(boxMap.keys()).forEach((label, i) => {
      const slot = i + 1;
      const focal = boxMap.get(label)!;
      const x = boxN * slot * focal;
      power += x;
    });
  });

  return power;
}

//

function calcHash(instruction: string) {
  return instruction
    .split("")
    .reduce((acc, char) => ((acc + char.charCodeAt(0)) * 17) % 256, 0);
}
