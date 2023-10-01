import { readInput } from "./_helpers.ts";

const lines = readInput("5").split("\n");

const instructionsStarts = lines.findIndex((line) => line.startsWith("move"));

type Stacks = Record<number, string[]>;
const stacks: Stacks = {};
lines
  .slice(0, instructionsStarts - 2)
  .reverse()
  .forEach((line) => {
    for (let i = 0; i < line.length; i += 4) {
      const stackIndex = Math.floor(i / 4);
      const crate = line.slice(i, i + 3);
      if (!crate.includes("[")) continue;
      if (stacks[stackIndex + 1] === undefined) {
        stacks[stackIndex + 1] = [crate];
      } else {
        stacks[stackIndex + 1].push(crate);
      }
    }
  });

const instructions = lines.slice(instructionsStarts).map((entry) => {
  const words = entry.split(" ");
  const quantity = parseInt(words[1], 10);
  const from = parseInt(words[3], 10);
  const to = parseInt(words[5], 10);

  return { quantity, from, to };
});

// Top line: 1-by-1 move
const stacks1: Stacks = structuredClone(stacks);
instructions.forEach(({ from, quantity, to }) => {
  for (let i = 0; i < quantity; i++) {
    const crate = stacks1[from].pop();
    if (crate) stacks1[to].push(crate);
  }
});

const answer1 = getTopLayer(stacks1);
console.log("Part 1:", answer1);

// Top line: all move
const stacks2: Stacks = structuredClone(stacks);
instructions.forEach(({ from, quantity, to }) => {
  const crates = stacks2[from].splice(-quantity);
  stacks2[to].push(...crates);
});

const answer2 = getTopLayer(stacks2);
console.log("Part 2:", answer2);

// Helpers

function getTopLayer(stacks: Stacks): string {
  return Object.values(stacks).reduce((acc, stack) => {
    const topCrate = stack.at(-1);
    if (topCrate) {
      return acc + topCrate.slice(1, 2);
    }
    return acc;
  }, "");
}
