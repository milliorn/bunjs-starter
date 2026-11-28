/// <reference types="bun-types" />

import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { main, writeTextFile } from "../writeFile.ts";
import { captureOutput } from "./helpers/captureOutput.ts";

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "bunjs-starter-writeFile-"));
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe("writeTextFile", () => {
  it("writes content to a file", async () => {
    const path = join(dir, "output.txt");
    await writeTextFile(path, "Sample");
    const file = Bun.file(path);
    expect(await file.exists()).toBe(true);
    expect((await file.text()).trim()).toBe("Sample");
  });

  it("throws error if filename is missing", async () => {
    await expect(writeTextFile("", "Sample")).rejects.toThrow(
      "Filename is required",
    );
  });

  it("throws error if content is missing", async () => {
    await expect(writeTextFile(join(dir, "output.txt"), "")).rejects.toThrow(
      "Content is required",
    );
  });
});

describe("main", () => {
  it("writes the given filename and content and logs success", async () => {
    const path = join(dir, "custom.txt");
    const output = await captureOutput(() => main([path, "Custom text"]));
    expect(output).toContain(`File "${path}" written successfully.`);
    expect(await Bun.file(path).text()).toBe("Custom text");
  });

  it("writes Hello World! to scratchFile.txt when no arguments are given", async () => {
    const originalCwd = process.cwd();
    process.chdir(dir);
    try {
      const output = await captureOutput(() => main([]));
      expect(output).toContain('File "scratchFile.txt" written successfully.');
      expect(await Bun.file(join(dir, "scratchFile.txt")).text()).toBe(
        "Hello World!",
      );
    } finally {
      process.chdir(originalCwd);
    }
  });

  it("logs the error and exits with code 1 when the write fails", async () => {
    const exitSpy = spyOn(process, "exit").mockImplementation(
      (() => undefined) as never,
    );
    try {
      const output = await captureOutput(() => main([dir]));
      expect(output).toContain("Error writing file:");
      expect(exitSpy).toHaveBeenCalledWith(1);
    } finally {
      exitSpy.mockRestore();
    }
  });
});
