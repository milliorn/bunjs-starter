/// <reference types="bun-types" />

import { describe, it, expect, afterEach } from "bun:test";
import { writeTextFile } from "../writeFile.ts";

const TEST_FILE = "testOutput.txt";

afterEach(async () => {
  // Clean up test file
  const file = Bun.file(TEST_FILE);
  if (await file.exists()) {
    await Bun.write(TEST_FILE, "");
    Bun.spawnSync({ cmd: ["rm", TEST_FILE] });
  }
});

describe("writeFile.ts", () => {
  it("writes content to a file", async () => {
    await writeTextFile(TEST_FILE, "Sample");
    const file = Bun.file(TEST_FILE);
    expect(await file.exists()).toBe(true);
    expect((await file.text()).trim()).toBe("Sample");
  });

  it("throws error if filename is missing", async () => {
    await expect(writeTextFile("", "Sample")).rejects.toThrow(
      "Filename is required",
    );
  });

  it("throws error if content is missing", async () => {
    await expect(writeTextFile(TEST_FILE, "")).rejects.toThrow(
      "Content is required",
    );
  });
});
