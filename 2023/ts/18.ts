/** @see https://adventofcode.com/2023/day/18 */

import { readInput } from "./_helpers.ts";

const filename = "18";
const actualInput = readInput(filename);
const exampleInput = readInput(filename + ".example");

const directions = ["U", "D", "L", "R"] as const;

// console.log("Part 1 (Example):", part1(exampleInput)); // 62
// console.log("Part 1 (Actual) :", part1(actualInput)); // 48795 (55853>X>11525
// console.log("Part 2 (Example):", part2(exampleInput)); // 952408144115
// console.log("Part 2 (Actual) :", part2(actualInput)); // 40654918441248

function part2(input: string) {
  const [trench, inner, total] = countInside(input.split("\n"), (line) => {
    const [, , hex] = line.split(" ");
    const n = Number.parseInt(hex.substring(2, 7), 16);
    const d =
      hex[7] === "0" ? "R" : hex[7] === "1" ? "D" : hex[7] === "2" ? "L" : "U";
    return [d, Number(n)] as const;
  });

  return {
    trench,
    inner,
    total,
  };
}

function part1(input: string) {
  const [trench, inner, total] = countInside(input.split("\n"), (line) => {
    const [d, n] = line.split(" ");
    return [d, Number(n)] as const;
  });

  return {
    trench,
    inner,
    total,
  };
}

function countInside(
  lines: string[],
  extractor: (line: string) => readonly [string, number]
) {
  let x = 0,
    y = 0;
  const sortedXs = [
    ...new Set(
      lines.map((line) => {
        const [d, n] = extractor(line);
        return (x += n * (d === "R" ? 1 : d === "L" ? -1 : 0));
      })
    ),
  ].sort((a, b) => a - b);
  const sortedYs = [
    ...new Set(
      lines.map((line) => {
        const [d, n] = extractor(line);
        return (y += n * (d === "D" ? 1 : d === "U" ? -1 : 0));
      })
    ),
  ].sort((a, b) => a - b);

  const xValues: Record<number, number> = {};
  {
    let lastX = sortedXs[0];
    for (const x of sortedXs) {
      if ((xValues[lastX] = x - lastX)) {
        xValues[x - 1] = x - lastX;
      }
      xValues[x] = 1;
      lastX = x + 1;
    }
  }
  const yValues: Record<number, number> = {};
  {
    let lastY = sortedYs[0];
    for (const y of sortedYs) {
      if ((yValues[lastY] = y - lastY)) {
        yValues[y - 1] = y - lastY;
      }
      yValues[y] = 1;
      lastY = y + 1;
    }
  }

  let minX = 0,
    maxX = 0,
    minY = 0,
    maxY = 0;

  const visited = new Set();

  function addPos(x: number, y: number) {
    visited.add(key(x, y));
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  x = 0;
  y = 0;
  let trench = 0;
  for (const line of lines) {
    const [d, n] = extractor(line);
    switch (d) {
      case "R":
        for (
          let i = n;
          i > 0;
          i -= xValues[x], x += xValues[x], trench += xValues[x]
        ) {
          addPos(x, y);
        }
        break;
      case "L":
        for (
          let i = n;
          i > 0;
          i -= xValues[x], x -= xValues[x], trench += xValues[x]
        ) {
          addPos(x - xValues[x] + 1, y);
        }
        break;
      case "U":
        for (
          let i = n;
          i > 0;
          i -= yValues[y], y -= yValues[y], trench += yValues[y]
        ) {
          addPos(x, y - yValues[y] + 1);
        }
        break;
      case "D":
        for (
          let i = n;
          i > 0;
          i -= yValues[y], y += yValues[y], trench += yValues[y]
        ) {
          addPos(x, y);
        }
        break;
    }
  }

  let inside: boolean | string = false;
  let count = 0;
  for (let y = minY; y <= maxY; y += yValues[y]) {
    for (let x = minX; x <= maxX; x += xValues[x]) {
      const here = visited.has(key(x, y));
      const above = visited.has(key(x, y - yValues[y - 1]));
      const below = visited.has(key(x, y + yValues[y]));
      if (here) {
        if (inside === false) {
          inside = above ? (below ? true : "u") : "d";
        } else if (inside === true) {
          inside = above ? (below ? false : "d") : "u";
        } else if (inside === "u") {
          inside = above ? false : below ? true : "u";
        } else if (inside === "d") {
          inside = above ? true : below ? false : "d";
        }
      } else {
        if (inside) {
          count += xValues[x] * yValues[y];
        }
      }
    }
  }
  return [trench, count, count + trench];
}

function key(...items: unknown[]) {
  return [...(typeof items === "object" ? items : arguments)].join(":");
}
