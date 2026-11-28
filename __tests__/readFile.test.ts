/// <reference types="bun-types" />

import { afterEach, describe, expect, it, spyOn } from "bun:test";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { main, readTextFile } from "../readFile.ts";
import { captureOutput } from "./helpers/captureOutput.ts";

const TEST_FILE = join(tmpdir(), "bunjs-starter-readFile.test.txt");

afterEach(async () => {
  const file = Bun.file(TEST_FILE);
  if (await file.exists()) await file.delete();
});

describe("readTextFile", () => {
  it("reads writeFile.txt and outputs Hello World!", async () => {
    const text = await readTextFile("writeFile.txt");
    expect(text.trim()).toBe("Hello World!");
  });

  it("errors gracefully for missing file", async () => {
    await expect(readTextFile("missing.txt")).rejects.toThrow("does not exist");
  });
});

describe("main", () => {
  it("prints writeFile.txt when no argument is given", async () => {
    const output = await captureOutput(() => main([]));
    expect(output.trim()).toBe("Hello World!");
  });

  it("prints the file given as the first argument", async () => {
    await Bun.write(TEST_FILE, "Custom content");
    const output = await captureOutput(() => main([TEST_FILE]));
    expect(output.trim()).toBe("Custom content");
  });

  it("logs the error and exits with code 1 for a missing file", async () => {
    const exitSpy = spyOn(process, "exit").mockImplementation(
      (() => undefined) as never,
    );
    try {
      const output = await captureOutput(() => main(["missing.txt"]));
      expect(output).toContain('File "missing.txt" does not exist.');
      expect(exitSpy).toHaveBeenCalledWith(1);
    } finally {
      exitSpy.mockRestore();
    }
  });
});
