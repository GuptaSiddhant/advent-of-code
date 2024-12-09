import {
  convertInputToGrid,
  findDirFromCoord,
  findNextCoordKeyInDir,
  getAllInDirFromCoord,
  parseCoordKey,
  solvePart,
  traverseGrid,
} from "./_utils.ts";

const year = 2024;
const day = 4;
const example = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;

solvePart(year, day, 1, part1, { input: example, result: 18 });
solvePart(year, day, 2, part2, { input: example, result: 9 });

function part1(input: string) {
  const { grid, maxX, maxY } = convertInputToGrid<Cell>(input);
  const startingCoords = traverseGrid(grid, [...grid.keys()], maxX, maxY, "X");
  const filtered = startingCoords
    .map(([key, nextKey]) =>
      getAllInDirFromCoord(grid, key, findDirFromCoord(key, nextKey))
    )
    .filter(Boolean);

  return filtered.length;
}

function part2(input: string) {
  const { grid, maxX, maxY } = convertInputToGrid<Cell>(input);
  const startingCoords = Array.from(
    grid.entries().filter(([key, value]) => {
      const { x, y } = parseCoordKey(key);
      if (x < 1 || x > maxX - 1) return false;
      if (y < 1 || y > maxY - 1) return false;
      return value === "A";
    })
  );
  const filtered = startingCoords.filter(([key]) => {
    const tlValue = grid.get(findNextCoordKeyInDir(key, "TL"));
    const trValue = grid.get(findNextCoordKeyInDir(key, "TR"));
    const blValue = grid.get(findNextCoordKeyInDir(key, "BL"));
    const brValue = grid.get(findNextCoordKeyInDir(key, "BR"));

    if (!tlValue || !trValue || !blValue || !brValue) return false;

    if (tlValue === "M" && trValue === "M") {
      return blValue === "S" && brValue === "S";
    }
    if (tlValue === "M" && blValue === "M") {
      return trValue === "S" && brValue === "S";
    }
    if (blValue === "M" && brValue === "M") {
      return tlValue === "S" && trValue === "S";
    }
    if (trValue === "M" && brValue === "M") {
      return tlValue === "S" && blValue === "S";
    }

    return false;
  });

  return filtered.length;
}

type Cell = "X" | "M" | "A" | "S";
