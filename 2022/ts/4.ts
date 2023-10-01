import { readInput } from "./_helpers.ts";

const entries = readInput("4")
  .split("\n")
  .map((line) =>
    line
      .split(",")
      .flatMap((x) => x.split("-"))
      .map((x) => parseInt(x, 10))
  );

// Complete overlap
const answer1 = entries.reduce((acc, entry) => {
  const [start1, end1, start2, end2] = entry;
  const is1Contain2 = start1 <= start2 && end1 >= end2;
  const is2Contain1 = start2 <= start1 && end2 >= end1;

  return is1Contain2 || is2Contain1 ? acc + 1 : acc;
}, 0);

console.log("Part 1:", answer1);

// Partial overlap
const answer2 = entries.reduce((acc, entry, i) => {
  const [start1, end1, start2, end2] = entry;

  return start2 > end1 || start1 > end2 ? acc : acc + 1;
}, 0);

console.log("Part 2:", answer2);
