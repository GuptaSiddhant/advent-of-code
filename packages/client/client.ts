// https://github.com/toblu/advent-of-code-client/blob/main/src/AocClient.ts
import "jsr:@std/dotenv/load";
import { getInput, postAnswer } from "./api.ts";

import type {
  CacheKeyParams,
  Cache,
  Config,
  PartFn,
  Result,
  TransformFn,
} from "./types.ts";
import { lines } from "./transforms.ts";

const getCacheKey = ({ year, day, token, part }: CacheKeyParams) =>
  `${year}:${day}:${token}:${part}`;
const consoleSuccess = console.log.bind(this, "✅");
const consoleFail = console.log.bind(this, "❌");

function genCache(): Cache {
  return {
    get: localStorage.getItem,
    set: localStorage.setItem,
    // delete: localStorage.removeItem,
    // clear: localStorage.clear,
  };
}

/**
 * A class that handles fetching input from and submitting answers to Advent Of Code.
 * Each instance of the class corresponds to a puzzle for a specific day and year based on the configuration.
 */
export class AocClient<T = string[]> {
  private config: Config;
  private cache: Cache;
  private transform: TransformFn<T>;

  constructor(year: number, day: number);
  constructor(year: number, day: number, transform: TransformFn<T>);
  constructor(year: number, day: number, transform?: TransformFn<T>) {
    if (
      !year ||
      Number.isNaN(year) ||
      year < 2015 ||
      year > new Date().getFullYear()
    ) {
      throw new Error(
        "Missing or invalid year option, year must be a number between 2015 and current year"
      );
    }
    if (!day || Number.isNaN(day) || day < 1 || day > 25) {
      throw new Error(
        "Missing or invalid day option, day must be a number between 1 and 25"
      );
    }

    const token = Deno.env.get("AOC_TOKEN");
    if (!token || typeof token !== "string") {
      throw new Error("Missing or invalid token option");
    }

    this.config = {
      year,
      day,
      token,
      useCache: true,
    };

    this.cache = genCache();
    this.transform = transform ?? (lines as TransformFn<T>);
  }

  private _hasCompletedPart(part: number) {
    const cacheKey = getCacheKey({ ...this.config, part });
    return this.cache.get(cacheKey) === true;
  }

  private _markCompletedPart(part: number) {
    const cacheKey = getCacheKey({ ...this.config, part });
    this.cache.set(cacheKey, true);
  }

  /**
   * Get the input for the puzzle.
   * @return the puzzle input. If a transform function has been set using the ´setInputTransform´ method it will return the transformed input, otherwise the raw input is returned.
   */
  async getInput(): Promise<T> {
    console.log("Fetching input...");
    const input = await getInput(this.config, this.cache);
    const trimmedInput = input.trim();
    return this.transform(trimmedInput);
  }

  /**
   * Submit puzzle answer for a specific part of the puzzle. If the part of the puzzle has already been completed, it will not be submitted again.
   * @param {number} part - the part of the puzzle that the answer is for (should be 1 or 2).
   * @param {number | string} answer - the answer to the puzzle.
   * @return {boolean} true if the answer was correct, false otherwise.
   */
  async submit(part: number, answer: Result): Promise<boolean> {
    if (part !== 1 && part !== 2) {
      return Promise.reject(new Error("Part must be either 1 or 2"));
    }

    console.log(`Submitting part ${part}...`);

    if (part === 1 && this._hasCompletedPart(1)) {
      consoleSuccess("Part 1 already completed");
      return Promise.resolve(true);
    }
    if (part === 2 && this._hasCompletedPart(2)) {
      consoleSuccess(
        "Part 2 already completed successfully, continue with next puzzle"
      );
      return Promise.resolve(true);
    }

    const { correct } = await postAnswer(
      { part, answer },
      this.config,
      this.cache
    );

    if (correct) {
      this._markCompletedPart(part);
    }

    const resultLogger = correct ? consoleSuccess : consoleFail;
    resultLogger(`Result: ${answer}`);

    if (part === 2 && correct) {
      console.log();
      console.log("All done! Great job, here's a cookie 🍪");
    }

    return correct;
  }

  /**
   * Run the puzzle parts (it can run either only part 1 or part 1 and 2) and submit the answers. A part that has previously been completed successfully will not run again.
   * @param {array} parts - an array with length of either 1 or 2. Each element in the array must be a function that takes the puzzle input and returns the calculated puzzle answer. The first element in the array corresponds to part 1 of the puzzle, and the second element (if specified) corresponds to part 2 of the puzzle.
   * @param {boolean} autoSubmit - when true the answers for each part will be submitted to Advent Of Code automatically, otherwise each answer will require confirmation before it will be submitted.
   */
  async run(
    parts: [part1: PartFn<T>] | [part1: PartFn<T>, part2: PartFn<T>],
    autoSubmit: boolean = false
  ) {
    if (!parts || !parts.length || parts.length > 2) {
      return Promise.reject(
        new Error("Parts must be an array with length between 1 and 2")
      );
    }

    if (
      typeof parts[0] !== "function" ||
      (parts[1] !== undefined && typeof parts[1] !== "function")
    ) {
      return Promise.reject(
        new Error("All elements in the parts array must be of type function")
      );
    }

    if (this._hasCompletedPart(1) && this._hasCompletedPart(2)) {
      console.log(
        "Both parts already completed successfully, continue with next puzzle ⭐️⭐️"
      );
      return Promise.resolve();
    }

    if (
      parts.length === 1 &&
      this._hasCompletedPart(1) &&
      !this._hasCompletedPart(2)
    ) {
      console.log(
        "Part 1 already completed successfully, continue with part 2 ⭐️"
      );
      return Promise.resolve();
    }

    const input = await this.getInput();
    const results: Array<Result> = [undefined, undefined];
    if (!this._hasCompletedPart(1)) {
      results[0] = parts[0](input);
    } else {
      consoleSuccess("Part 1 already completed");
    }
    if (!this._hasCompletedPart(2) && parts.length === 2) {
      results[1] = parts[1](input);
    }

    if (autoSubmit) {
      console.log("Submitting answers automatically");
      if (results[0] !== undefined) {
        await this.submit(1, results[0]);
      }
      if (results[1] !== undefined) {
        await this.submit(2, results[1]);
      }
      return Promise.resolve();
    }
    if (results[0] !== undefined) {
      console.log("Your result from part 1 is", results[0]);
      const userInput = confirm("Do you want to submit it? (Y/N):");
      if (!userInput) return Promise.resolve();
      await this.submit(1, results[0]);
    }
    if (results[1] !== undefined) {
      console.log("Your result from part 2 is", results[1]);
      const userInput = confirm("Do you want to submit it? (Y/N):");
      if (!userInput) return Promise.resolve();
      await this.submit(2, results[1]);
    }
    return Promise.resolve();
  }
}
