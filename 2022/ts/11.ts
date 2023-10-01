/**
 * Advent of code 2022 (TS) - Day 11
 * @see https://adventofcode.com/2022/day/11
 */

import { readInput } from "./_helpers.ts";

const filename = "11";
const actualInput = readInput(filename);
const exampleInput = readInput(filename + ".example");

console.log("Part 1 (Example):", part1(exampleInput));
console.log("Part 1 (Actual) :", part1(actualInput));
console.log("Part 2 (Example):", part2(exampleInput));
console.log("Part 2 (Actual) :", part2(actualInput));

// Part 1:
function part1(input: string) {
  const monkeys = parseMonkeysFromInput(input);
  runInspections(monkeys, 20, (n) => Math.floor(n / 3));
  return calcMonkeyBusiness(monkeys);
}

// Part 2:
function part2(input: string) {
  const monkeys = parseMonkeysFromInput(input);
  const lcmDivs = monkeys
    .map((m) => m.divBy)
    .reduce((acc, val) => acc * val, 1);

  runInspections(monkeys, 10000, (n) => n % lcmDivs);
  return calcMonkeyBusiness(monkeys);
}

// Helpers

function runInspections(
  monkeys: Monkey[],
  rounds: number,
  transformResult: (n: number) => number
) {
  for (let round = 0; round < rounds; round++) {
    for (let m = 0; m < monkeys.length; m++) {
      const monkey = monkeys[m];
      monkey.inspectCount += monkey.items.length;

      while (monkey.items.length !== 0) {
        const item = monkey.items.shift();
        if (!item || Number.isNaN(item)) break;
        const result = transformResult(monkey.operation(item));
        const newMonkeyId = monkey.test(result) ? monkey.true : monkey.false;
        monkeys[newMonkeyId].items.push(result);
      }
    }
  }
}

function calcMonkeyBusiness(monkeys: Monkey[]) {
  const inspections = monkeys.map((m) => m.inspectCount);

  return inspections
    .sort((a, b) => b - a)
    .slice(0, 2)
    .reduce((acc, val) => acc * val, 1);
}

function getNumberInLine(line: string, splitWord: string) {
  return Number.parseInt(line.split(splitWord)[1].trim(), 10);
}

function parseMonkeysFromInput(input: string): Array<Monkey> {
  return input
    .split("Monkey")
    .map((m) => {
      const [id, itemsStr, operationStr, testStr, trueStr, falseStr] =
        m.split("\n");

      if (!id) return undefined;

      return {
        id: Number.parseInt(id.trim(), 10),
        items: getNumberListInLine(itemsStr, "items:"),
        operation: createOperation(operationStr),
        test: createTest(testStr),
        true: getNumberInLine(trueStr, "monkey"),
        false: getNumberInLine(falseStr, "monkey"),
        divBy: getNumberInLine(testStr, "by"),
        inspectCount: 0,
      };
    })
    .filter(Boolean) as Array<Monkey>;
}

function getNumberListInLine(line: string, splitWord: string) {
  return line
    .split(splitWord)[1]
    .split(",")
    .map((i) => Number.parseInt(i.trim(), 10));
}

function createOperation(operationStr: string): (n: number) => number {
  const [operand1, operation, operand2] = operationStr
    .split("new = ")[1]
    .split(" ");

  return (n) => {
    const a = operand1 === "old" ? n : Number.parseInt(operand1, 10);
    const b = operand2 === "old" ? n : Number.parseInt(operand2, 10);
    if (operation === "+") return a + b;
    if (operation === "*") return a * b;
    if (operation === "-") return a - b;
    if (operation === "/") return a / b;
    return n;
  };
}

function createTest(testStr: string): (n: number) => boolean {
  const divider = getNumberInLine(testStr, "by");
  return (n) => n % divider === 0;
}

interface Monkey {
  id: number;
  items: Array<number>;
  operation: (n: number) => number;
  test: (n: number) => boolean;
  true: number;
  false: number;
  divBy: number;
  inspectCount: number;
}
