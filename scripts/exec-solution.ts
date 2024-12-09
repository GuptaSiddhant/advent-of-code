import { parseArgs } from "jsr:@std/cli";

import {
  generateInputFilename,
  readInputFileText,
} from "../typescript/_utils.ts";

const today = new Date();
const { day, year, watch } = parseArgs(Deno.args, {
  alias: { y: "year", d: "day", w: "watch" },
  string: ["year", "day"],
  boolean: ["watch"],
  default: { year: today.getFullYear(), day: today.getDate(), watch: false },
});

console.group(`%cAOC  Year: ${year}, Day: ${day}`, "color: cyan;");
try {
  readInputFileText(Number(year), Number(day));

  new Deno.Command(Deno.execPath(), {
    args: [
      "test",
      "-R",
      watch ? "--watch" : "",
      `typescript/${generateInputFilename(year, day)}.ts`,
    ],
    stdout: "inherit",
    stderr: "inherit",
  }).outputSync();
} catch (error) {
  console.error(
    `%c ${error instanceof Error ? error.message : error}`,
    "color: red;"
  );
} finally {
  console.groupEnd();
}
