import { solvePart } from "./_utils.ts";

const year = 2024;
const day = 3;
const example = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))
`;

solvePart(year, day, 1, part1, { input: example, result: 161 });
solvePart(year, day, 2, part2, { input: example, result: 48 });

function part1(input: string) {
  const { str } = parseInput(input);
  const matches = str.match(/mul\(\d{1,3},\d{1,3}\)/g);

  let result = 0;
  matches?.forEach((match) => {
    result += convertStrToMul(match);
  });

  return result;
}

function part2(input: string) {
  const { str } = parseInput(input);
  const matches = str.matchAll(/mul\(\d{1,3},\d{1,3}\)/g);

  let result = 0;
  matches?.forEach((match) => {
    const index = match.index;
    const prefix = str.slice(0, index);
    const lastDo = prefix.lastIndexOf("do()");
    const lastDont = prefix.lastIndexOf("don't()");
    const enabled = (lastDo === -1 && lastDont === -1) || lastDo > lastDont;

    if (enabled) {
      result += convertStrToMul(match[0]);
    }
  });

  return result;
}

function parseInput(input: string) {
  const str = input.replaceAll(/\n/g, "");

  return { str };
}

function convertStrToMul(str: string) {
  const num1 = Number(str.split("(")[1].split(",")[0]);
  const num2 = Number(str.split(")")[0].split(",")[1]);
  return num1 * num2;
}
