import { readInput } from "./_helpers.ts";

const rucksacks = readInput("3").split("\n");

const priorityMap = new Map<string, number>();
"abcdefghijklmnopqrstuvwxyz".split("").forEach((letter, index) => {
  const priority = index + 1;
  priorityMap.set(letter, priority);
  priorityMap.set(letter.toUpperCase(), priority + 26);
});

const rucksacksWithCompartments = rucksacks.map((line) => {
  const size = line.length;
  if (size % 2 !== 0) throw new Error("Invalid size");
  const half = size / 2;
  return [line.slice(0, half), line.slice(half)];
});

const answer1 = rucksacksWithCompartments.reduce((acc, [left, right]) => {
  const rightSet = right.split("");
  const repeating = left
    .split("")
    .filter((letter) => rightSet.includes(letter));
  const unique = Array.from(new Set(repeating));

  const priorityScore = unique.reduce(
    (acc, letter) => acc + (priorityMap.get(letter) || 0),
    0
  );

  return acc + priorityScore;
}, 0);

console.log("Part 1:", answer1);

// ---

const rucksacksGroups: string[][] = [];
rucksacks.forEach((line, index) => {
  const groupNo = Math.floor(index / 3);
  if (!rucksacksGroups[groupNo]) rucksacksGroups[groupNo] = [line];
  else rucksacksGroups[groupNo].push(line);
});

const badges = rucksacksGroups.map((group) => {
  const [left, middle, right] = group;
  const leftSet = left.split("");
  const middleSet = middle.split("");
  const rightSet = right.split("");

  const repeating = leftSet
    .filter((letter) => middleSet.includes(letter))
    .filter((letter) => rightSet.includes(letter));

  const unique = Array.from(new Set(repeating));

  return unique[0];
});

const answer2: number = badges
  .map((badge) => priorityMap.get(badge) || 0)
  .reduce((acc, score) => acc + score, 0);
console.log("Part 2:", answer2);
