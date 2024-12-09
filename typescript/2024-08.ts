import {
  convertInputToGrid,
  CoordKey,
  createCoordKey,
  Grid,
  parseCoordKey,
  solvePart,
} from "./_utils.ts";

const year = 2024;
const day = 8;
const example1 = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`;
const example2 = `T.........
...T......
.T........
..........
..........
..........
..........
..........
..........
..........`;

solvePart(
  year,
  day,
  1,
  part1,
  { input: example1, result: 14 },
  { input: example2, result: 3 }
);

solvePart(
  year,
  day,
  2,
  part2,
  { input: example1, result: 34 },
  { input: example2, result: 9 }
);

const antennaRegex = /^[A-Za-z0-9]$/;
type Cell = "." | (string & {});
const pairSeparator = ":";

function part1(input: string) {
  const { grid, maxX, maxY } = convertInputToGrid<Cell>(input);
  const nodes = getNodes(grid);

  const antiNodes = new Set<CoordKey>();
  nodes.entries().forEach(([, set]) => {
    const pairs = generatePairs(set);
    pairs.forEach((pair) => {
      generateAntiNodesFromPair(pair, maxX, maxY).forEach((key) =>
        antiNodes.add(key)
      );
    });
  });

  return antiNodes.size;
}

function part2(input: string) {
  const { grid, maxX, maxY } = convertInputToGrid<Cell>(input);
  const nodes = getNodes(grid);

  const antiNodes = new Set<CoordKey>();
  nodes.entries().forEach(([, set]) => {
    const pairs = generatePairs(set);
    pairs.forEach((pair) => {
      generateAntiNodesFromPair(pair, maxX, maxY, true).forEach((key) =>
        antiNodes.add(key)
      );
    });
    set.forEach((key) => antiNodes.add(key));
  });

  return antiNodes.size;
}

function getNodes(grid: Grid<Cell>) {
  const nodes = new Map<string, Set<CoordKey>>();
  grid
    .entries()
    .filter(([, value]) => antennaRegex.test(value))
    .forEach(([key, value]) => {
      const set = nodes.get(value) || new Set();
      set.add(key);
      nodes.set(value, set);
    });

  return nodes;
}

function generatePairs(set: Set<CoordKey>) {
  return [
    ...new Set(
      [...set].flatMap((key, _, arr) =>
        arr
          .map((oKey) =>
            key === oKey ? undefined : [key, oKey].sort().join(pairSeparator)
          )
          .filter((key) => key !== undefined)
      )
    ),
  ];
}

function generateAntiNodesFromPair(
  pair: string,
  maxX: number,
  maxY: number,
  infinite = false
) {
  const antiNodes = new Set<CoordKey>();
  const [key1, key2] = pair.split(pairSeparator);
  const { x: x1, y: y1 } = parseCoordKey(key1 as CoordKey);
  const { x: x2, y: y2 } = parseCoordKey(key2 as CoordKey);
  const dy = y2 - y1;
  const dx = x2 - x1;

  let x3 = x2 + dx;
  let y3 = y2 + dy;
  while (true) {
    if (x3 >= 0 && x3 <= maxX && y3 >= 0 && y3 <= maxY) {
      antiNodes.add(createCoordKey(x3, y3));

      if (!infinite) break;
      x3 += dx;
      y3 += dy;
    } else {
      break;
    }
  }

  let x4 = x1 - dx;
  let y4 = y1 - dy;
  while (true) {
    if (x4 >= 0 && x4 <= maxX && y4 >= 0 && y4 <= maxY) {
      antiNodes.add(createCoordKey(x4, y4));

      if (!infinite) break;
      x4 -= dx;
      y4 -= dy;
    } else {
      break;
    }
  }

  return antiNodes;
}
