import { findLocation } from "./5.helper.ts";

self.addEventListener("message", (event: any) => {
  const from: number = event.data.from;
  const length: number = event.data.length;
  //   const index: number = event.data.index;
  let min: number = event.data.min;
  //   const label = `Worker ${index}:`;
  //   console.time(label);
  //   console.log(label, from, length);

  for (let i = 0; i < length; i++) {
    const seed = from + i;
    const location = findLocation(seed);
    if (location < min) {
      min = location;
      //   console.log(label, { seed, location });
    }
  }

  //   console.log(label, min);
  //   console.timeEnd(label);
  (self as any).postMessage(min);
  self.close();
});

//
