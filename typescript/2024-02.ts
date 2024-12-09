import { solvePart } from "./_utils.ts";

const year = 2024;
const day = 2;
const example = `7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`;

solvePart(year, day, 1, part1, { input: example, result: 2 });
solvePart(year, day, 2, part2, { input: example, result: 4 });

function part1(input: string) {
  const { reports } = parseInput(input);
  let safeCount = 0;

  for (const report of reports) {
    if (checkSafeReport(report)) {
      safeCount++;
    }
  }

  return safeCount;
}

function part2(input: string) {
  const { reports } = parseInput(input);
  let safeCount = 0;

  for (let i = 0; i < reports.length; i++) {
    const report = reports[i];

    if (checkSafeReport(report)) {
      safeCount++;
    } else {
      const reportCombinations = Array.from({ length: report.length }).map(
        (_, j) => {
          return [...report.slice(0, j), ...report.slice(j + 1)];
        }
      );
      const isAnySafe = reportCombinations.some(checkSafeReport);

      if (isAnySafe) {
        safeCount++;
      }
    }
  }

  return safeCount;
}

function parseInput(input: string) {
  const reports = input
    .split("\n")
    .map((line) => line.split(/\s+/).map(Number));

  return { reports };
}

function checkSafeReport(report: number[]): boolean {
  let prevLevel: number | null = null;
  let direction: "inc" | "dec" | undefined;

  for (let i = 0; i < report.length; i++) {
    const level = report[i]!;
    if (prevLevel === null) {
      prevLevel = level;
      continue;
    }

    const diff = prevLevel - level;

    // console.log(prevLevel, level, diff);
    if (Math.abs(diff) < 1 || Math.abs(diff) > 3) {
      return false;
    }

    const newDirection: typeof direction = diff < 0 ? "dec" : "inc";

    if (!direction) {
      direction = newDirection;
    } else {
      // console.log(direction, newDirection);
      if (direction !== newDirection) {
        return false;
      }
    }

    prevLevel = level;
  }

  return true;
}
