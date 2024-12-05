/**
 * Advent of code 2024 (TS) - Day 5
 * @see https://adventofcode.com/2024/day/5
 */

import { readInput } from "./_helpers.ts";

const filename = "5";
const actualInput = readInput(filename);
const exampleInput = readInput(filename + ".example");

console.log("Part 1 (Example):", part1(exampleInput)); // 143
console.log("Part 1 (Actual) :", part1(actualInput)); // 5991
console.log("Part 2 (Example):", part2(exampleInput)); // 123
console.log("Part 2 (Actual) :", part2(actualInput)); // 5479

// Part 1:
function part1(input: string) {
  const parts = input.split("\n\n");

  const ruleMap = createRuleMap(parts[0]);
  const updates = parts[1]
    .split("\n")
    .map((line) => line.split(",").map(Number));

  const correctUpdates = updates.filter((update) => {
    for (let i = 0; i < update.length; i++) {
      const page = update[i];
      const ruleSet = ruleMap.get(page);
      if (!ruleSet) return false;

      const befores = new Set(update.slice(0, i));
      const afters = new Set(update.slice(i + 1));

      if (
        ruleSet.pre.isSupersetOf(befores) &&
        ruleSet.post.isSupersetOf(afters)
      ) {
        continue;
      } else {
        return false;
      }
    }
    return true;
  });

  return correctUpdates.reduce((acc, update) => {
    const middleIndex =
      update.length % 2 === 1 ? (update.length - 1) / 2 : update.length / 2;
    return acc + update[middleIndex];
  }, 0);
}

// Part 2:
function part2(input: string) {
  const parts = input.split("\n\n");

  const ruleMap = createRuleMap(parts[0]);
  const updates = parts[1]
    .split("\n")
    .map((line) => line.split(",").map(Number));

  const inCorrectUpdates = updates.filter((update) => {
    for (let i = 0; i < update.length; i++) {
      const page = update[i];
      const ruleSet = ruleMap.get(page);
      if (!ruleSet) return true;

      const befores = new Set(update.slice(0, i));
      const afters = new Set(update.slice(i + 1));

      if (
        !ruleSet.pre.isSupersetOf(befores) ||
        !ruleSet.post.isSupersetOf(afters)
      ) {
        return true;
      }
    }
    return false;
  });

  const sortedUpdates = inCorrectUpdates.map((update) => {
    return update.sort((a, b) => {
      const aRuleSet = ruleMap.get(a);
      if (!aRuleSet) return 1;

      if (aRuleSet.post.has(b)) return 1;
      if (aRuleSet.pre.has(b)) return -1;

      return 0;
    });
  });

  return sortedUpdates.reduce((acc, update) => {
    const middleIndex =
      update.length % 2 === 1 ? (update.length - 1) / 2 : update.length / 2;
    return acc + update[middleIndex];
  }, 0);
}

function createRuleMap(rulePart: string) {
  const rules = rulePart.split("\n").map((line) => line.split("|").map(Number));

  const ruleMap = new Map<number, { pre: Set<number>; post: Set<number> }>();
  for (const rule of rules) {
    const [before, after] = rule;
    if ((!before && !after) || before === after) continue;
    const beforeRuleSet = ruleMap.get(before);
    if (!beforeRuleSet) {
      ruleMap.set(before, { post: new Set([after]), pre: new Set() });
    } else {
      beforeRuleSet.post.add(after);
      ruleMap.set(before, beforeRuleSet);
    }

    const afterRuleSet = ruleMap.get(after);
    if (!afterRuleSet) {
      ruleMap.set(after, { pre: new Set([before]), post: new Set() });
    } else {
      afterRuleSet.pre.add(before);
      ruleMap.set(after, afterRuleSet);
    }
  }
  return ruleMap;
}
