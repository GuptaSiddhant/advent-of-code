//
export type Part = { x: number; m: number; a: number; s: number };
export type WorkflowMap = Map<string, Rule[]>;
export type Rule = { result: Result; condition: Condition | null };
export type Condition = {
  category: keyof Part;
  greater: boolean;
  value: number;
};
export type Result = string | "A" | "R";

export function checkIfPartAccepted(
  part: Part,
  workflows: WorkflowMap,
  defaultWorkflowId: string
): boolean {
  let workflowId = defaultWorkflowId;
  let accepted = false;
  while (true) {
    const result = runWorkflow(part, workflows.get(workflowId)!);
    if (result === "A") {
      accepted = true;
      break;
    }
    if (result === "R") break;
    workflowId = result;
  }
  return accepted;
}

function runWorkflow(part: Part, rules: Rule[]): Result {
  for (let i = 0; i <= rules.length; i++) {
    const rule = rules[i];
    if (!rule.condition) return rule.result;
    const { category, greater, value } = rule.condition;
    const partValue = part[category];
    if (greater ? partValue > value : partValue < value) return rule.result;
    else continue;
  }

  return rules[rules.length - 1].result;
}

export function parseInput(input: string): {
  parts: Part[];
  workflows: WorkflowMap;
} {
  const [workflowsSet, partsSet] = input
    .split("\n\n")
    .map((set) => set.split("\n"));

  const workflows: WorkflowMap = new Map<string, Rule[]>();
  workflowsSet.forEach((line) => {
    const [id, rulesLine] = line.split("}")[0].split("{");
    const rules: Rule[] = rulesLine.split(",").map((rule) => {
      const [condition, result] = rule.split(":");
      if (!result) return { result: condition, condition: null };
      return {
        condition: {
          category: condition[0] as keyof Part,
          greater: condition[1] === ">",
          value: Number(condition.substring(2)),
        },
        result: result.trim(),
      };
    });
    workflows.set(id, rules);
  });

  const parts: Part[] = partsSet.map((line) => {
    const [x, m, a, s] = line.split("}")[0].split("{")[1].split(",");
    return {
      x: Number(x.split("=")[1]),
      m: Number(m.split("=")[1]),
      a: Number(a.split("=")[1]),
      s: Number(s.split("=")[1]),
    };
  });

  return { parts, workflows };
}
