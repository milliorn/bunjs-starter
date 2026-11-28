/// <reference types="bun-types" />

import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import { join } from "node:path";
import { main, readTextFile } from "../readFile.ts";
import { captureOutput } from "./helpers/captureOutput.ts";
import { REPO_ROOT, useTempDir, withCwd } from "./helpers/fs.ts";

const tempDir = useTempDir("readFile");

afterEach(() => {
  mock.restore();
});

describe("readTextFile", () => {
  it("reads writeFile.txt and outputs Hello World!", async () => {
    const text = await readTextFile(join(REPO_ROOT, "writeFile.txt"));
    expect(text.trim()).toBe("Hello World!");
  });

  it("errors gracefully for missing file", async () => {
    await expect(readTextFile(join(tempDir(), "missing.txt"))).rejects.toThrow(
      "does not exist",
    );
  });
});

describe("main", () => {
  it("prints writeFile.txt when no argument is given", async () => {
    const output = await withCwd(REPO_ROOT, () => captureOutput(() => main([])));
    expect(output.trim()).toBe("Hello World!");
  });

  it("prints the file given as the first argument", async () => {
    const path = join(tempDir(), "input.txt");
    await Bun.write(path, "Custom content");
    const output = await captureOutput(() => main([path]));
    expect(output.trim()).toBe("Custom content");
  });

  it("logs the error and exits with code 1 for a missing file", async () => {
    const missing = join(tempDir(), "missing.txt");
    const exitSpy = spyOn(process, "exit").mockImplementation(
      (() => undefined) as never,
    );
    const output = await captureOutput(() => main([missing]));
    expect(output).toContain(`File "${missing}" does not exist.`);
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
