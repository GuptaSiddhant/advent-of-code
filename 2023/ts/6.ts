import { readInput } from "./_helpers.ts";

const filename = "6";
const actualInput = readInput(filename);
const exampleInput = readInput(filename + ".example");

console.log("Part 1 (Example):", part1(exampleInput));
console.log("Part 1 (Actual) :", part1(actualInput));

console.log("Part 2 (Example):", part2(exampleInput));
console.log("Part 2 (Actual) :", part2(actualInput));

function part1(input: string) {
  const lines = input.split("\n");
  const times = lines[0].match(/\d+/g)!.map(Number);
  const distances = lines[1].match(/\d+/g)!.map(Number);
  const races: Race[] = times.map((time, i) => ({
    time,
    distance: distances[i],
  }));

  const winCombos = races.map(calcWinCombos);
  const margin = winCombos.reduce((acc, cur) => acc * cur, 1);

  return margin;
}

function part2(input: string) {
  const lines = input.split("\n");
  const time = Number(lines[0].replaceAll(" ", "").split(":")[1]);
  const distance = Number(lines[1].replaceAll(" ", "").split(":")[1]);
  const race: Race = { time, distance };
  const winCombos = calcWinCombos(race);

  return winCombos;
}

// Helpers

type Race = { time: number; distance: number };

function calcWinCombos({ time, distance }: Race) {
  let winCombos = 0;
  for (let speed = 1; speed < time; speed++) {
    const distanceCovered = speed * (time - speed);
    if (distanceCovered > distance) winCombos++;
  }

  return winCombos;
}
