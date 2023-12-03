import { readInput } from "./_helpers.ts";

const filename = "3";
const actualInput = readInput(filename);
const exampleInput = readInput(filename + ".example");

// console.log("Part 1 (Example):", part1(exampleInput));
// console.log("Part 1 (Actual) :", part1(actualInput));
// // 549908
// console.log("Part 2 (Example):", part2(exampleInput)); // 467835
console.log("Part 2 (Actual) :", part2(actualInput));
// incorrect 47841343

function part1(input: string) {
  const rows = input.split("\n");
  const numbers = getAllNumbers(rows);
  const parts = getPartNumbers(numbers, rows);

  return parts.reduce((acc, { num }) => acc + num, 0);
}

function part2(input: string) {
  const rows = input.split("\n");
  const numbers = getAllNumbers(rows);
  const parts = getPartNumbers(numbers, rows);

  const asterisks = rows.flatMap((line, rowIndex) => {
    return line
      .split("")
      .map((char, colIndex) => (char === "*" ? { rowIndex, colIndex } : null))
      .filter(Boolean);
  }) as {
    rowIndex: number;
    colIndex: number;
  }[];

  const gears = asterisks.filter(({ rowIndex, colIndex }) => {
    const neighbors: { char: string; x: number; y: number }[] = [];

    for (let y = rowIndex - 1; y <= rowIndex + 1; y++) {
      for (let x = colIndex - 1; x <= colIndex + 1; x++) {
        const char = getCharAtXY(rows, x, y);
        if (!char || !"0123456789".includes(char)) continue;

        if (!neighbors.some((n) => n.x === x - 1 || n.x === x - 2))
          neighbors.push({ char, x, y });
      }
    }

    return neighbors.length > 1;
  });

  console.log(asterisks.length, gears.length);

  const ratios = gears.map(({ rowIndex, colIndex }) => {
    const nearParts = parts.filter(
      ({ rowIndex: partRowIndex, colIndexEnd, colIndexStart }) => {
        return (
          rowIndex >= partRowIndex - 1 &&
          rowIndex <= partRowIndex + 1 &&
          colIndex >= colIndexStart - 1 &&
          colIndex <= colIndexEnd + 1
        );
      }
    );

    if (nearParts.length !== 2) {
      console.log("nearParts", nearParts);
      throw new Error("Invalid number of parts");
    }

    return nearParts.reduce((acc, { num }) => acc * num, 1);
  });

  return ratios.reduce((acc, num) => acc + num, 0);
}

// Helpers

function getAllNumbers(rows: string[]) {
  return rows.flatMap((line, rowIndex) => {
    const matches = [];
    const regex = RegExp("\\d+", "g");
    let array: RegExpExecArray | null = null;
    while ((array = regex.exec(line)) !== null) {
      matches.push({
        num: parseInt(array[0]),
        rowIndex,
        colIndexStart: array.index,
        colIndexEnd: array.index + array[0].length - 1,
      });
    }

    return matches;
  });
}

function getPartNumbers(
  numbers: ReturnType<typeof getAllNumbers>,
  rows: string[]
) {
  return numbers.filter(({ colIndexEnd, colIndexStart, rowIndex }) => {
    for (let x = colIndexStart - 1; x <= colIndexEnd + 1; x++) {
      for (let y = rowIndex - 1; y <= rowIndex + 1; y++) {
        const char = getCharAtXY(rows, x, y);
        if (!char || ".0123456789".includes(char)) continue;
        return true;
      }
    }
    return false;
  });
}

function getCharAtXY(rows: string[], x: number, y: number): string | undefined {
  return rows.at(y)?.at(x);
}
