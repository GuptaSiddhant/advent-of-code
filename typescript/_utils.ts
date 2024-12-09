import { assertEquals } from "jsr:@std/assert";
import { resolve } from "jsr:@std/path";

export function generateInputFilename(
  year: number | string,
  day: number | string
) {
  return `${year}-${day.toString().padStart(2, "0")}`;
}

export function readInputFileText(year: number, day: number) {
  return Deno.readTextFileSync(
    resolve(
      import.meta.dirname ?? "",
      "..",
      "inputs",
      `${generateInputFilename(year, day)}.txt`
    )
  );
}

export function solvePart<R>(
  year: number,
  day: number,
  part: 1 | 2,
  solutionFn: (input: string) => NoInfer<R>,
  ...examples: { input: string; result: R }[]
) {
  Deno.test(`${generateInputFilename(year, day)} Part ${part}`, () => {
    for (const example of examples) {
      assertEquals(solutionFn(example.input), example.result);
    }

    const result = solutionFn(readInputFileText(year, day));
    console.log(result);
  });
}
