import { generateCombinations, solvePart } from "./_utils.ts";

const year = 2024;
const day = 7;
const example = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;

solvePart(year, day, 1, part1, { input: example, result: 3749 });
solvePart(year, day, 2, part2, { input: example, result: 11387 });

function part1(input: string) {
  const { equations } = parseInput(input);
  const validEquations = equations.filter((e) =>
    filterValidEquation(e, ["*", "+"])
  );

  return validEquations.reduce((acc, { result }) => acc + result, 0);
}

function part2(input: string) {
  const { equations } = parseInput(input);
  const validEquations = equations.filter((e) =>
    filterValidEquation(e, ["*", "+", "|"])
  );

  return validEquations.reduce((acc, { result }) => acc + result, 0);
}

function parseInput(input: string) {
  const equations = input.split("\n").map((line): Equation => {
    const [result, rest] = line.split(":");
    return {
      result: Number(result),
      operands: rest.trim().split(" ").map(Number),
    };
  });

  return { equations };
}

type Equation = { result: number; operands: number[] };

function filterValidEquation<T extends "+" | "*" | "|">(
  { operands, result }: Equation,
  operators: Readonly<[T, ...T[]]>
) {
  const operatorsCount = operands.length - 1;

  const operatorsCombinations = generateCombinations(operators, operatorsCount);

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
        default:
          return acc;
      }
    }, operands[0]);
    return sol === result;
  });
}
