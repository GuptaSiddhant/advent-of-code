/**
 * Advent of code 2024 (TS) - Day 7
 * @see https://adventofcode.com/2024/day/7
 */

import { readInput } from "./_helpers.ts";

const filename = "7";
const actualInput = readInput(filename);
const exampleInput = readInput(filename + ".example");

const operators1 = ["*", "+", "|"] as const;

// console.log("Part 1 (Example):", part1(exampleInput)); // 3749
// console.log("Part 1 (Actual) :", part1(actualInput)); // 42283209483350
console.log("Part 2 (Example):", part1(exampleInput)); // 11387
console.log("Part 2 (Actual) :", part1(actualInput)); // 1026766857276279

function part1(input: string) {
  const equations = input.split("\n").map((line) => {
    const [result, rest] = line.split(":");
    return {
      result: Number(result),
      operands: rest.trim().split(" ").map(Number),
    };
  });

  const validEquations = equations.filter(({ operands, result }) => {
    const operatorsCount = operands.length - 1;

    const operatorsCombinations: OperatorsList[] = generateOperatorCombinations(
      operators1,
      operatorsCount
    );

    return operatorsCombinations.some((combo) => {
      const sol = operands.reduce((acc, value, index) => {
        if (index === 0) return acc;
        const operand = combo[index - 1];
        switch (operand) {
          case "*":
            return acc * value;
          case "+":
            return acc + value;
          case "|":
            return Number(`${acc}${value}`);
        }
      }, operands[0]);
      return sol === result;
    });
  });

  return validEquations.reduce((acc, { result }) => acc + result, 0);
}

export function generateOperatorCombinations<T>(
  values: Readonly<[T, ...T[]]>,
  count: number
): T[][] {
  function LoopIt(
    depth: number,
    baseString: string,
    arrLetters: Readonly<[T, ...T[]]>
  ) {
    let returnValue = "";
    for (let i = 0; i < arrLetters.length; i++) {
      returnValue +=
        depth == 1
          ? "," + baseString + arrLetters[i]
          : LoopIt(depth - 1, baseString + arrLetters[i], arrLetters);
    }
    return returnValue;
  }
  return LoopIt(count, "", values)
    .split(",")
    .filter(Boolean)
    .map((c) => c.split("") as T[]);
}

type OperatorsList = Array<(typeof operators1)[number]>;
