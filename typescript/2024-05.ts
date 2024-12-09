import { solvePart } from "./_utils.ts";

const year = 2024;
const day = 5;
const example = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;

solvePart(year, day, 1, part1, { input: example, result: 143 });
solvePart(year, day, 2, part2, { input: example, result: 123 });

function part1(input: string) {
  const { updates, ruleMap } = parseInput(input);

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

function part2(input: string) {
  const { ruleMap, updates } = parseInput(input);

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

function parseInput(input: string) {
  const parts = input.split("\n\n");

  const ruleMap = createRuleMap(parts[0]);
  const updates = parts[1]
    ?.split("\n")
    .map((line) => line.split(",").map(Number));

  return { updates, ruleMap };
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
