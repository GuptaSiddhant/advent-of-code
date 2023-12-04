import { readInput } from "./_helpers.ts";

const filename = "3";
const actualInput = readInput(filename);
const exampleInput = readInput(filename + ".example");

// console.log("Part 1 (Example):", part1(exampleInput));
// console.log("Part 1 (Actual) :", part1(actualInput));
// // 549908
console.log("Part 2 (Example):", part2x(exampleInput)); // 467835
console.log("Part 2 (Actual) :", part2x(actualInput));
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

/**
 * code for part 2 of the advent of code puzzle
 *
 * @param {string} input
 * @returns {Promise<string | number>} the result of part 2
 */
function part2x(input: string) {
  const grid = input.split(/\n/g).map((line) => line.split(""));
  const gearNumbers: Record<string, number[]> = {};

  for (let y = 0; y < grid.length; y++) {
    let currentNumber = "",
      checkNumber = false,
      gearLocation = null;

    for (let x = 0; x < grid[y].length; x++) {
      // if current spot is a number and we aren't checking them yet, start checking
      if (grid[y][x].match(/[0-9]/) && !checkNumber) {
        checkNumber = true;
        currentNumber = "";
        gearLocation = null;
      }

      // if we find a non-number or at end of the row, stop checking and add to sum if needed
      if (
        (x == grid[y].length - 1 || !grid[y][x].match(/[0-9]/)) &&
        checkNumber
      ) {
        if (gearLocation)
          gearNumbers[gearLocation].push(
            parseInt(
              currentNumber + (grid[y][x].match(/[0-9]/) ? grid[y][x] : "")
            )
          );
        checkNumber = false;
      }

      // if we are checking for numbers, add current spot to number and check for '*' around it
      if (checkNumber) {
        currentNumber += grid[y][x];

        // check for star
        for (let j = -1; j <= 1; j++) {
          for (let i = -1; i <= 1; i++) {
            if (i == 0 && j == 0) continue;
            if (
              y + j < 0 ||
              y + j >= grid.length ||
              x + i < 0 ||
              x + i >= grid[y].length
            )
              continue;

            const char = grid[y + j][x + i];
            if (char == "*") {
              gearLocation = `${x + i},${y + j}`;
              if (gearNumbers[gearLocation] == null)
                gearNumbers[gearLocation] = [];
            }
          }
        }
      }
    }
  }

  // add all gear numbers multiplied
  return Object.values(gearNumbers).reduce((sum, array) => {
    if (array.length == 2) sum += array[0] * array[1];
    return sum;
  }, 0);
}
