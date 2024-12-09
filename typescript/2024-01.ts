import { solvePart } from "./_utils.ts";

const year = 2024;
const day = 1;
const example = `3   4
4   3
2   5
1   3
3   9
3   3`;

solvePart(year, day, 1, part1, { input: example, result: 11 });
solvePart(year, day, 2, part2, { input: example, result: 31 });

function part1(input: string) {
  const { array1, array2 } = parseInput(input);
  array1.sort();
  array2.sort();

  const distances = array1.map((item, index) => {
    return Math.abs(item - array2[index]);
  });

  return distances.reduce((acc, item) => acc + item, 0);
}

function part2(input: string) {
  const { array1, array2 } = parseInput(input);
  const map = new Map<number, number>();

  let score = 0;

  for (const item of array1) {
    if (map.has(item)) {
      const oldScore = map.get(item)!;
      score += item * oldScore;
    } else {
      const newScore = array2.filter((i2) => i2 === item).length;
      map.set(item, newScore);
      score += item * newScore;
    }
  }

  return score;
}

function parseInput(input: string) {
  const array1: number[] = [];
  const array2: number[] = [];
  const lines = input
    .split("\n")
    .map((line) => line.split(/\s+/) as [string, string]);
  for (const line of lines) {
    array1.push(Number(line[0]));
    array2.push(Number(line[1]));
  }
  return { array1, array2 };
}
