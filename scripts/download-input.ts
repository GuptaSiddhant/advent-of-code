import "jsr:@std/dotenv/load";
import { parseArgs } from "jsr:@std/cli";
import { exists, ensureDir } from "jsr:@std/fs";
import { join, resolve } from "jsr:@std/path";
import { getInput } from "@aoc/client/api";
import { generateInputFilename } from "../typescript/_utils.ts";

const today = new Date();
const args = parseArgs(Deno.args, {
  alias: { y: "year", d: "day" },
  string: ["year", "day"],
  collect: ["day"],
  default: { year: today.getFullYear(), day: today.getDate() },
});

const inputsDirPath = resolve(import.meta.dirname ?? "", "../inputs");
const { year } = args;
const days = Array.isArray(args.day)
  ? args.day.length === 1 && args.day[0] === "0"
    ? Array.from({ length: 25 }).map((_, i) => i + 1)
    : args.day.map(Number)
  : [Number(args.day)];
const token = Deno.env.get("AOC_TOKEN");

await ensureDir(inputsDirPath);

for (const day of days) {
  console.group(`%cAOC  Year: ${year}, Day: ${day}`, "color: cyan;");
  try {
    const fileName = `${generateInputFilename(year, day)}.txt`;
    const filePath = join(inputsDirPath, fileName);
    const isDownloaded = await exists(filePath);
    if (isDownloaded) {
      console.info(`%c Already downloaded input`, "color: yellow;");
      continue;
    }

    const input = await getInput({
      year: Number(year),
      day: day,
      token,
    }).then((txt) =>
      txt
        .split("\n")
        .filter((line) => line.trim() !== "")
        .join("\n")
    );

    Deno.writeTextFile(filePath, input);
    console.info(`%c Downloaded and saved input`, "color: green;");
  } catch (error) {
    console.error(
      `%c ${error instanceof Error ? error.message : error}`,
      "color: red;"
    );
    Deno.exit(1);
  } finally {
    console.groupEnd();
  }
}
