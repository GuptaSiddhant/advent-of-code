import { readInput } from "./_helpers.ts";

const scores = {
  Rock: 1,
  Paper: 2,
  Scissor: 3,
  Win: 6,
  Lose: 0,
  Draw: 3,
} as const;

const matches = readInput("2")
  .split("\n")
  .map((match) => match.split(" ") as [Opponent, Player]);

const totalScoreStrategy1 = matches.reduce(
  (score, [opponent, player]) =>
    score + getMoveScore(player) + getDuelScore(player, opponent),
  0
);

console.log("Total score (Strategy 1):", totalScoreStrategy1);

const totalScoreStrategy2 = matches.reduce(
  (score, [opponent, result]) =>
    score + getResultScore(result) + getMoveScoreByResult(result, opponent),
  0
);

console.log("Total score (Strategy 2):", totalScoreStrategy2);

// ---

// Rock A X
// Paper B Y
// Scissors C Z

type Opponent = "A" | "B" | "C";
type Player = "X" | "Y" | "Z";

function getDuelScore(player: Player, opponent: Opponent) {
  const normalisedOpponent: Player =
    opponent === "A" ? "X" : opponent === "B" ? "Y" : "Z";

  if (player === normalisedOpponent) return scores.Draw;
  if (normalisedOpponent === "X" && player === "Y") return scores.Win;
  if (normalisedOpponent === "Y" && player === "Z") return scores.Win;
  if (normalisedOpponent === "Z" && player === "X") return scores.Win;

  return scores.Lose;
}

function getMoveScore(move: Player | Opponent) {
  return move === "X" || move === "A"
    ? scores.Rock
    : move === "Y" || move === "B"
    ? scores.Paper
    : scores.Scissor;
}

function getMoveScoreByResult(result: Player, opponent: Opponent) {
  // draw
  if (result === "Y") return getMoveScore(opponent);
  // Lose
  if (result === "X") {
    if (opponent === "A") return scores.Scissor;
    if (opponent === "B") return scores.Rock;
    return scores.Paper;
  }
  // Win
  if (opponent === "A") return scores.Paper;
  if (opponent === "B") return scores.Scissor;
  return scores.Rock;
}

function getResultScore(result: Player) {
  return result === "Z"
    ? scores.Win
    : result === "X"
    ? scores.Lose
    : scores.Draw;
}
