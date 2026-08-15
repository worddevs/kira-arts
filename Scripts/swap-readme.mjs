import { rename, access } from "node:fs/promises";
import { constants } from "fs";

const README = "README.md";
const README_NPM = "README.npm.md";
const README_GITHUB_BACKUP = "README.github.md";

async function exists(path) {
  try {
    await access(path, constants.F_OK);

    return true;
  } catch {
    return false;
  }
}

const mode = process.argv[2];

if (mode === "before") {
  if (!(await exists(README_NPM))) {
    console.warn(`[swap-readme] ${README_NPM} not found, skipping swap.`);

    process.exit(0);
  }

  await rename(README, README_GITHUB_BACKUP);
  await rename(README_NPM, README);

  console.log(`[swap-readme] Swapped in ${README_NPM} as ${README} for packing.`);
} else if (mode === "after") {
  if (!(await exists(README_GITHUB_BACKUP))) {
    console.warn(`[swap-readme] ${README_GITHUB_BACKUP} not found, nothing to restore.`);

    process.exit(0);
  }

  await rename(README, README_NPM);
  await rename(README_GITHUB_BACKUP, README);

  console.log(`[swap-readme] Restored original ${README}.`);
} else {
  console.error('[swap-readme] Usage: node swap-readme.mjs "before" | "after"');

  process.exit(1);
}
