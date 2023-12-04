import { readInput } from "./_helpers.ts";

const filename = "4";
const actualInput = readInput(filename);
const exampleInput = readInput(filename + ".example");

// console.log("Part 1 (Example):", part1(exampleInput));
// console.log("Part 1 (Actual) :", part1(actualInput));

// console.log("Part 2 (Example):", part2(exampleInput));
console.log("Part 2 (Actual) :", part2(actualInput));

function part1(input: string) {
  const cards = input.split("\n").map(parseCard);
  const matches = cards.map(findMatches);

  const points = matches.map((m) => {
    const length = m.length;
    if (length === 0) return 0;
    if (length === 1) return 1;

    const remainder = length - 1;
    return 2 ** remainder;
  });

  return points.reduce((a, b) => a + b, 0);
}

function part2(input: string) {
  const cards = input.split("\n").map(parseCard);
  const matches = new Map<number, number>();

  cards.forEach((card, index) => {
    matches.set(index + 1, findMatches(card).length);
  });

  const newCards: Card[] = [...cards];

  for (const card of newCards) {
    const wins = matches.get(card.num) || 0;

    if (wins === 0) continue;

    const winCards = cards.slice(card.num, card.num + wins);

    newCards.push(...winCards);
  }

  return newCards.length;
}

// Helpers

function parseCard(line: string) {
  // Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
  const [index, data] = line.split(": ");
  const num = Number(index.split("Card ")[1].trim());
  const [winners, yours] = data?.split("|");
  const winnerNumbers = winners.split(" ").map(Number).filter(Boolean);
  const yourNumbers = yours.split(" ").map(Number).filter(Boolean);

  return { num, winnerNumbers, yourNumbers };
}

function findMatches(card: Card) {
  const { winnerNumbers, yourNumbers } = card;
  const matches = winnerNumbers.filter((n) => yourNumbers.includes(n));
  return matches;
}

type Card = ReturnType<typeof parseCard>;
