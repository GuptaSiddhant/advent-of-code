// https://github.com/toblu/advent-of-code-client/blob/main/src/util/api.ts
import type { Cache, Config, Result } from "./types.ts";

const HOST_URI = "https://adventofcode.com";
const NOT_FOUND = "404 not found";
const TOO_EARLY_REQUEST_TEXT =
  "please don't repeatedly request this endpoint before it unlocks";
const UNAUTHENTICATED_INPUT_TEXT = "please log in to get your puzzle input";
const INTERNAL_SERVER_ERROR_TEXT = "internal server error";
const HTML_RESPONSE_TEXT = "!DOCTYPE HTML";
const CORRECT_ANSWER_TEXT = "that's the right answer";
const INCORRECT_ANSWER_TEXT = "that's not the right answer";
const TOO_RECENT_ANSWER_TEXT =
  "you gave an answer too recently; you have to wait after submitting an answer before trying again.";
const INCORRECT_LEVEL_TEXT = "you don't seem to be solving the right level";

const fetchFromCacheOrAoC = async (
  cacheKey: string,
  uri: string,
  options: RequestInit,
  cache?: Cache
): Promise<string> => {
  if (cache) {
    const cachedResponse = cache.get(cacheKey);
    // use the cached response response if it exists
    if (cachedResponse) {
      console.debug(
        "Found a previously cached response, returning response from cache"
      );
      return Promise.resolve(cachedResponse);
    }
    // otherwise call AoC
    console.debug(
      "No previously cached response found, fetching from Advent Of Code"
    );
  }
  const response = await fetch(uri, options);
  return response.text();
};

export async function getInput(config: Config, cache?: Cache) {
  const { year, day, token } = config;
  const uri = `${HOST_URI}/${year}/day/${day}/input`;
  const options = {
    method: "get",
    headers: {
      "Content-Type": "text/plain",
      Cookie: `session=${token}`,
    },
  };

  const cacheKey = JSON.stringify({ uri, token });

  const textResponse = await fetchFromCacheOrAoC(cacheKey, uri, options, cache);

  if (textResponse.toLowerCase().includes(NOT_FOUND)) {
    return Promise.reject(new Error("The puzzle not found."));
  }

  if (textResponse.toLowerCase().includes(UNAUTHENTICATED_INPUT_TEXT)) {
    return Promise.reject(
      new Error(
        "You must log in to get your puzzle input, please provide a valid token"
      )
    );
  }

  if (textResponse.toLowerCase().includes(TOO_EARLY_REQUEST_TEXT)) {
    return Promise.reject(
      new Error(
        "This puzzle has not opened yet, please wait until the puzzle unlocks!"
      )
    );
  }

  if (textResponse.toLowerCase().includes(INTERNAL_SERVER_ERROR_TEXT)) {
    return Promise.reject(
      new Error(
        "An unexpected error occurred while fetching the input, internal server error."
      )
    );
  }

  if (textResponse.includes(HTML_RESPONSE_TEXT)) {
    return Promise.reject(
      new Error(
        "An error occurred while fetching the input. Are you authenticated correctly?"
      )
    );
  }

  if (cache && !cache.get(cacheKey)) {
    // update cache if it had not been set previously
    cache.set(cacheKey, textResponse);
  }
  return textResponse;
}

type Params = {
  part: Result;
  answer: Result;
};

export const postAnswer = async (
  { part, answer }: Params,
  config: Config,
  cache: Cache
) => {
  const { year, day, token } = config;
  const uri = `${HOST_URI}/${year}/day/${day}/answer`;
  const options = {
    method: "post",
    headers: {
      Cookie: `session=${token}`,
      "cache-control": "no-cache",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      level: `${part}`,
      answer: `${answer}`,
    }),
  };
  const cacheKey = JSON.stringify({
    uri,
    token,
    part,
    answer,
  });
  const cachedResponse = cache.get(cacheKey);

  const textResponse = await fetchFromCacheOrAoC(cacheKey, uri, options, cache);

  const text = textResponse.toLowerCase();
  if (text.includes(CORRECT_ANSWER_TEXT)) {
    if (cache && !cachedResponse) {
      // Update cache if no previously cached response
      cache.set(cacheKey, textResponse);
    }
    return Promise.resolve({ correct: true });
  }
  if (text.includes(INCORRECT_ANSWER_TEXT)) {
    if (cache && !cachedResponse) {
      // Update cache if no previously cached response
      cache.set(cacheKey, textResponse);
    }
    return Promise.resolve({ correct: false });
  }
  if (text.includes(TOO_RECENT_ANSWER_TEXT)) {
    const leftToWaitText = text
      .split(TOO_RECENT_ANSWER_TEXT)[1]
      .split(".")[0]
      .trim();
    return Promise.reject(
      new Error(`You gave an answer too recently, ${leftToWaitText}.`)
    );
  }
  if (text.includes(TOO_EARLY_REQUEST_TEXT)) {
    return Promise.reject(
      new Error(
        "This puzzle has not opened yet, please wait until the puzzle unlocks!"
      )
    );
  }
  if (text.includes(INCORRECT_LEVEL_TEXT)) {
    return Promise.reject(
      new Error(
        "You don't seem to be solving the correct level. Did you already complete it?"
      )
    );
  }
  return Promise.reject(
    new Error("Unknown response from AoC. Are you authenticated correctly?")
  );
};
