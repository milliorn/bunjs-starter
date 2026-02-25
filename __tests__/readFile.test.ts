/// <reference types="bun-types" />

import { describe, it, expect } from "bun:test";
import { readTextFile } from "../readFile.ts";

describe("readFile.ts", () => {
  it("reads writeFile.txt and outputs Hello World!", async () => {
    const text = await readTextFile("writeFile.txt");
    expect(text.trim()).toBe("Hello World!");
  });

  it("errors gracefully for missing file", async () => {
    await expect(readTextFile("missing.txt")).rejects.toThrow("does not exist");
  });
});
