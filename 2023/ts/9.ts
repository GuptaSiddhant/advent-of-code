import { readInput } from "./_helpers.ts";

const filename = "9";
const actualInput = readInput(filename);
const exampleInput = readInput(filename + ".example");


console.log("Part 1 (Example):", part1(exampleInput));
console.log("Part 1 (Actual) :", part1(actualInput)); 

console.log("Part 2 (Example):", part2(exampleInput));
console.log("Part 2 (Actual) :", part2(actualInput));

function part1(input: string) {
    const entries = input.split("\n").filter(Boolean).map(line => line.split(" ").map(Number))
    const x: number[] = []

    for (let i = 0; i < entries.length; i++) {        
        const entryMap = new Map<number, number[]>();
        entryMap.set(0, entries[i])
        let j = 0
        while ((entryMap.get(j)!).some(Boolean)) {
            const arr = getSubArray(entryMap.get(j)!)
            entryMap.set(++j, arr);
        }
        for (let k = entryMap.size - 1; k > 0; k--) {
            const a = entryMap.get(k)!.at(-1);
            const b = entryMap.get(k - 1)!.at(-1);
            const c = a + b
            entryMap.get(k - 1)!.push(c)
        }
        x.push(entryMap.get(0)!.at(-1))
    }

    return x.reduce((acc, a) => acc + a, 0)
}

function part2(input: string) {
    const entries = input.split("\n").filter(Boolean).map(line => line.split(" ").map(Number))
    const x: number[] = []

    for (let i = 0; i < entries.length; i++) {        
        const entryMap = new Map<number, number[]>();
        entryMap.set(0, entries[i])
        let j = 0
        while ((entryMap.get(j)!).some(Boolean)) {
            const arr = getSubArray(entryMap.get(j)!)
            entryMap.set(++j, arr);
        }
        
        for (let k = entryMap.size - 1; k > 0; k--) {
            const a = entryMap.get(k)![0];
            const b = entryMap.get(k - 1)![0];
            const c = b-a            
            entryMap.get(k - 1)!.unshift(c)
        }
        x.push(entryMap.get(0)![0])
    }

    return x.reduce((acc, a) => acc + a, 0)
}

function getSubArray(entry: number[]) {
    const newEntry: number[] = []
    let i = 0;
    while (i < entry.length - 1) {
        const a = entry[i], b = entry[++i];
        newEntry.push(b - a);
    }
    return newEntry;
}