export type CacheKeyParams = {
  year: number;
  day: number;
  token?: string;
  part: number;
};

export type Config = {
  year: number;
  day: number;
  token?: string;
};

export type Cache = {
  get: (key: string) => any;
  set: (key: string, value: any) => void;
};

export type TransformFn<T = any> = (input: string) => T;

export type Result = number | string | undefined;

export type PartFn<T> = (input: T) => Result;
