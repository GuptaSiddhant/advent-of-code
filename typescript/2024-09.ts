import { solvePart } from "./_utils.ts";

const year = 2024;
const day = 9;
const example = `2333133121414131402`;

solvePart(year, day, 1, part1, { input: example, result: 1928 });
solvePart(year, day, 2, part2, { input: example, result: 2858 });

function part1(input: string) {
  const { representation, fileCount } = parseDiskMap(input);

  representation.forEach((v, i, arr) => {
    if (i >= fileCount) {
      return;
    }
    if (v === ".") {
      const lastIndex = arr.findLastIndex((c) => c !== ".");
      representation[i] = representation[lastIndex];
      representation[lastIndex] = ".";
    }
  });

  return representation
    .filter((v) => v !== ".")
    .reduce((acc, v, i) => acc + v * i, 0);
}

function part2(input: string) {
  const { files, freeSpaces } = parseDiskMap(input);

  const filledSpaces: Representation[] = [];
  for (let i = 0; i < freeSpaces.length; i++) {
    const freeSpace = freeSpaces[i];
    const length = freeSpace.length;

    const matchFileIndex = files.findLastIndex(
      (f, j) => f.length <= length && f.length > 0 && j > i
    );
    const matchFile = files[matchFileIndex];
    if (matchFile) {
      const dots = Array.from({ length: length - matchFile.length }).fill(
        "."
      ) as "."[];
      // if (dots.length > 0) {
      //   shouldStop = false;
      // }

      filledSpaces.push([...matchFile, ...dots]);
    }
    files[matchFileIndex] = [];
  }

  const newRep: Representation[] = [];
  for (let i = 0; i < files.length; i++) {
    newRep.push(files[i]);
    if (filledSpaces[i + 1]) {
      newRep.push(filledSpaces[i]);
    }
  }

  // diskMap = newRep.flat().join("");
  // console.log(genDiskMap(newRep.flat()));

  return newRep
    .flat()
    .filter((v) => v !== ".")
    .reduce((acc, v, i) => acc + v * i, 0);
}

function parseDiskMap(diskMap: string) {
  const representation: Representation = [];

  const files: number[][] = [];
  const freeSpaces: "."[][] = [];

  let fileId = 0;
  let fileCount = 0;

  for (let i = 0; i < diskMap.length; i++) {
    const length = Number(diskMap[i]);
    const isFile = i % 2 === 0;

    if (isFile) {
      const file = Array.from({ length }).fill(fileId) as Array<number>;
      representation.push(...file);
      files.push(file);
      fileCount += length;
      fileId++;
    } else {
      const freeSpace = Array.from({ length }).fill(".") as Array<".">;
      representation.push(...freeSpace);
      freeSpaces.push(freeSpace);
    }
  }

  return { representation, fileCount, files, freeSpaces };
}

type Representation = Array<number | ".">;

// function genDiskMap(rep: Representation) {
//   let map = "";
//   const x = rep
//     .join("")
//     .matchAll(/(0+)|(1+)|(2+)|(3+)|(4+)|(5+)|(6+)|(7+)|(8+)|(9+)|(\.+)/g);

//     let isFree = false;
//   x.forEach(match => {
//     const x = match['0'];
//     if (x)

//     map+= match['0']
//   })
//   console.log([...x]);
// }
