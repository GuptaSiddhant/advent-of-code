import { readInput } from "./_helpers.ts";

const filename = "8";
const actualInput = readInput(filename);
const exampleInput1 = readInput(filename + ".example1");
const exampleInput2 = readInput(filename + ".example2");

console.log("Part 1 (Example):", part1(exampleInput1));
console.log("Part 1 (Actual) :", part1(actualInput)); // 11309

console.log("Part 2 (Example):", part2(exampleInput2));
console.log("Part 2 (Actual) :", part2(actualInput));

function part1(input: string) {
  const { nodes, instructions } = parseInput(input);
  let steps = 0;
  let currentNodeName = "AAA";
  const instructionsCount = instructions.length;
  while (currentNodeName !== "ZZZ") {
    const currentNode = nodes.get(currentNodeName)!;
    const instruction = instructions[steps % instructionsCount];
    currentNodeName = currentNode[instruction];
    steps++;
  }

  return steps;
}

function part2(input: string) {
  const { nodes, instructions } = parseInput(input);
  const nodesEndWithA = [...nodes.keys()].filter((name) => name.endsWith("A"));

  //   console.time("part2");
  //   let steps = 0;
  //   let currentNodeNames = nodesEndWithA;
  //   const instructionsCount = instructions.length;
  //   while (!currentNodeNames.every((name) => name.endsWith("Z"))) {
  //     const instruction = instructions[steps % instructionsCount];
  //     currentNodeNames = currentNodeNames.map(
  //       (name) => nodes.get(name)![instruction]
  //     );
  //     steps++;
  //     if (currentNodeNames.some((n) => n.endsWith("Z")))
  //       console.timeLog("part2", steps);
  //   }
  //   console.timeEnd("part2");
  //   return steps;

  // LCM approach (found on Reddit)
  const stepsForEachNode = nodesEndWithA.map((name) => {
    let steps = 0;
    let currentNodeName = name;
    const instructionsCount = instructions.length;
    while (!currentNodeName.endsWith("Z")) {
      const currentNode = nodes.get(currentNodeName)!;
      const instruction = instructions[steps % instructionsCount];
      currentNodeName = currentNode[instruction];
      steps++;
    }
    return steps;
  });

  return leastCommonMultiple(stepsForEachNode);
}

// Helpers
function parseInput(input: string) {
  const lineSet = input.split("\n\n");
  type Instruction = "L" | "R";
  const instructions = lineSet[0].split("") as Array<Instruction>;
  const nodes = new Map<string, Record<Instruction, string>>();
  lineSet[1].split("\n").forEach((line) => {
    const [name, next] = line.split(" = ");
    const [L, R] = next.match(/[A-Z0-9]{3}/g)!;
    nodes.set(name, { L, R });
  });
  return { nodes, instructions };
}

function leastCommonMultiple(numbers: number[]): number {
  const min = Math.min(...numbers);

  function gcd(a: number, b: number): number {
    return !b ? a : gcd(b, a % b);
  }

  function lcm(a: number, b: number): number {
    return (a * b) / gcd(a, b);
  }

  let multiple = min;
  numbers.forEach((n) => {
    multiple = lcm(multiple, n);
  });

  return multiple;
}
