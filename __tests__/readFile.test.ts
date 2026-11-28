/// <reference types="bun-types" />

import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { main, readTextFile } from "../readFile.ts";
import { captureOutput } from "./helpers/captureOutput.ts";

const REPO_ROOT = join(import.meta.dir, "..");

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "bunjs-starter-readFile-"));
});

afterEach(() => {
  mock.restore();
  rmSync(dir, { recursive: true, force: true });
});

describe("readTextFile", () => {
  it("reads writeFile.txt and outputs Hello World!", async () => {
    const text = await readTextFile(join(REPO_ROOT, "writeFile.txt"));
    expect(text.trim()).toBe("Hello World!");
  });

  it("errors gracefully for missing file", async () => {
    await expect(readTextFile(join(dir, "missing.txt"))).rejects.toThrow(
      "does not exist",
    );
  });
});

describe("main", () => {
  it("prints writeFile.txt when no argument is given", async () => {
    const originalCwd = process.cwd();
    process.chdir(REPO_ROOT);
    try {
      const output = await captureOutput(() => main([]));
      expect(output.trim()).toBe("Hello World!");
    } finally {
      process.chdir(originalCwd);
    }
  });

  it("prints the file given as the first argument", async () => {
    const path = join(dir, "input.txt");
    await Bun.write(path, "Custom content");
    const output = await captureOutput(() => main([path]));
    expect(output.trim()).toBe("Custom content");
  });

  it("logs the error and exits with code 1 for a missing file", async () => {
    const missing = join(dir, "missing.txt");
    const exitSpy = spyOn(process, "exit").mockImplementation(
      (() => undefined) as never,
    );
    const output = await captureOutput(() => main([missing]));
    expect(output).toContain(`File "${missing}" does not exist.`);
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
