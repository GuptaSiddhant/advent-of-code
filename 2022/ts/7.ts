import { readInput } from "./_helpers.ts";

const rootPath = "/";
const rootDir: FsDir = {
  path: rootPath,
  parentPath: null,
  totalSize: 0,
};

let cwd = rootPath;
const fileSystem: FileSystem = {
  files: [],
  dirs: { [rootPath]: rootDir },
};

buildFileSystem();
calcDirTotalSize();

// Tasks 1 - Sum of all dirs with size<100000
const LIMIT = 100_000;
const dirsWithSizeLessThanLimit = Object.values(fileSystem.dirs).filter(
  (dir) => dir.totalSize <= LIMIT
);
const answer1 = dirsWithSizeLessThanLimit.reduce(
  (acc, dir) => acc + dir.totalSize,
  0
);
console.log("Part 1:", answer1);

// Task 2 -

const MAX_SPACE = 70_000_000;
const EMPTY_SPACE = 30_000_000;
const MAX_USED_SPACE = MAX_SPACE - EMPTY_SPACE;

const usedSpace = fileSystem.dirs[rootPath].totalSize;
const sizeToDelete = usedSpace - MAX_USED_SPACE;

const dirToDelete = Object.values(fileSystem.dirs)
  .filter((dir) => dir.totalSize >= sizeToDelete)
  .sort((a, b) => a.totalSize - b.totalSize)[0];

const answer2 = dirToDelete.totalSize;
console.log("Part 2:", answer2);

// Helpers

function calcDirTotalSize(): void {
  Object.values(fileSystem.dirs).map((dir) => {
    const allFilesInDir = fileSystem.files.filter((f) =>
      f.parentPath.startsWith(dir.path)
    );
    dir.totalSize = allFilesInDir.reduce((acc, f) => acc + f.size, 0);
  });
}

function buildFileSystem() {
  const commands = readInput("7").split(/\n?\$\s/);
  commands.forEach((command) => {
    if (!command) return;
    if (command.startsWith("cd")) {
      cd(command.slice(3).trim());
    }
    if (command.startsWith("ls")) {
      ls(command.slice(3).trim());
    }
  });
}

function ls(list: string): void {
  const dir = cwd;
  list.split("\n").forEach((content) => {
    if (content.startsWith("dir")) {
      mkDir(dir, content.slice(3).trim());
    } else {
      const [size, name] = content.split(" ");
      touch(dir, name, Number(size));
    }
  });
}

function cd(newDirName: string): void {
  const dir = cwd;

  // go Root
  if (newDirName === rootPath) {
    cwd = rootPath;
    return;
  }
  // go back
  if (newDirName === "..") {
    if (dir === rootPath) return;
    cwd = dir.slice(0, dir.lastIndexOf("/"));
    return;
  }
  // go to child
  cwd = genPath(newDirName, dir);
  return;
}

function mkDir(dir: string, name: string): void {
  const newDir: FsDir = {
    totalSize: 0,
    parentPath: dir,
    path: genPath(name, dir),
  };
  fileSystem.dirs[newDir.path] = newDir;
}

function touch(dir: string, name: string, size: number): void {
  const file: FsFile = {
    name,
    size,
    parentPath: dir || rootPath,
    path: genPath(name, dir),
  };

  fileSystem.files.push(file);
}

function genPath(name: string, dir = cwd): string {
  return dir === "/" ? `/${name}` : `${dir}/${name}`;
}

//   Types

type FileSystem = {
  files: FsFile[];
  dirs: Record<string, FsDir>;
};

type FsFile = {
  name: string;
  size: number;
  path: string;
  parentPath: string;
};

type FsDir = {
  path: string;
  parentPath: string | null;
  totalSize: number;
};
