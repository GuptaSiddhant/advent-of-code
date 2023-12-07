import { readInput } from "./_helpers.ts";

const filename = "7";
const actualInput = readInput(filename);
const exampleInput = readInput(filename + ".example");

enum HandType {
  HighCard, //0
  OnePair, //1
  TwoPairs, //2
  ThreeOfAKind, //3
  FullHouse, //4
  FourOfAKind, //5
  FiveOfAKind, //6
}

console.log("Part 1 (Example):", part1(exampleInput));
console.log("Part 1 (Actual) :", part1(actualInput));
// 251597210

console.log("Part 2 (Example):", part2(exampleInput));
console.log("Part 2 (Actual) :", part2(actualInput));

function part1(input: string) {
  const cardLabels = "AKQJT98765432";
  const hands = input.split("\n").map((line) => {
    const [hand, bid] = line.split(" ");
    const type = getHandTypePart1(hand);
    return { type, hand, bid: Number(bid) };
  });
  const sorted = hands.toSorted((a, b) => {
    if (a.type !== b.type) return b.type - a.type;
    return compareSameTypeHand(a.hand, b.hand, cardLabels);
  });
  const maxRank = hands.length;
  const rank = sorted.reduce(
    (acc, hand, index) => acc + hand.bid * (maxRank - index),
    0
  );

  return rank;
}

function part2(input: string) {
  const cardLabels = "AKQT98765432J";
  const hands = input.split("\n").map((line) => {
    const [hand, bid] = line.split(" ");
    const type = getHandTypePart2(hand);
    return { type, hand, bid: Number(bid) };
  });
  const sorted = hands.toSorted((a, b) => {
    if (a.type !== b.type) return b.type - a.type;
    return compareSameTypeHand(a.hand, b.hand, cardLabels);
  });
  const maxRank = hands.length;
  const rank = sorted.reduce(
    (acc, hand, index) => acc + hand.bid * (maxRank - index),
    0
  );
  return rank;
}

// Helpers

function getHandTypePart1(hand: string) {
  const cards = hand.split("");
  const cardCounts = new Map<string, number>();
  for (const card of cards) {
    cardCounts.set(card, (cardCounts.get(card) || 0) + 1);
  }
  const values = [...cardCounts.values()];

  return getHandType(values);
}

function getHandTypePart2(hand: string) {
  const cards = hand.split("");
  const cardsWithoutJ = cards.filter((c) => c !== "J");
  const jCount = cards.length - cardsWithoutJ.length;
  const cardCounts = new Map<string, number>();
  for (const card of cardsWithoutJ) {
    cardCounts.set(card, (cardCounts.get(card) || 0) + 1);
  }
  let maxCard: string | undefined;
  let maxCount = 0;
  cardCounts.forEach((count, card) => {
    if (count > maxCount) {
      maxCard = card;
      maxCount = count;
    }
  });
  cardCounts.set(maxCard!, cardCounts.get(maxCard!)! + jCount);

  const values = [...cardCounts.values()];

  return getHandType(values);
}

function compareSameTypeHand(a: string, b: string, cardLabels: string): number {
  for (let i = 0; i < a.length; i++) {
    const aIndex = cardLabels.indexOf(a[i]);
    const bIndex = cardLabels.indexOf(b[i]);
    if (aIndex === bIndex) continue;
    return aIndex - bIndex;
  }
  return 0;
}

function getHandType(values: number[]) {
  if (values.length === 1) return HandType.FiveOfAKind;
  if (values.length === 2) {
    if (values.includes(4)) return HandType.FourOfAKind;
    return HandType.FullHouse;
  }
  if (values.length === 3) {
    if (values.includes(3)) return HandType.ThreeOfAKind;
    return HandType.TwoPairs;
  }
  if (values.length === 4) return HandType.OnePair;
  return HandType.HighCard;
}
