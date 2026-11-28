/// <reference types="bun-types" />

import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import { join } from "node:path";
import { main, writeTextFile } from "../writeFile.ts";
import { captureOutput } from "./helpers/captureOutput.ts";
import { useTempDir, withCwd } from "./helpers/fs.ts";

const tempDir = useTempDir("writeFile");

afterEach(() => {
  mock.restore();
});

describe("writeTextFile", () => {
  it("writes content to a file", async () => {
    const path = join(tempDir(), "output.txt");
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
    await expect(writeTextFile(join(tempDir(), "output.txt"), "")).rejects.toThrow(
      "Content is required",
    );
  });
});

describe("main", () => {
  it("writes the given filename and content and logs success", async () => {
    const path = join(tempDir(), "custom.txt");
    const output = await captureOutput(() => main([path, "Custom text"]));
    expect(output).toContain(`File "${path}" written successfully.`);
    expect(await Bun.file(path).text()).toBe("Custom text");
  });

  it("writes Hello World! to scratchFile.txt when no arguments are given", async () => {
    const output = await withCwd(tempDir(), () => captureOutput(() => main([])));
    expect(output).toContain('File "scratchFile.txt" written successfully.');
    expect(await Bun.file(join(tempDir(), "scratchFile.txt")).text()).toBe(
      "Hello World!",
    );
  });

  it("logs the error and exits with code 1 when the write fails", async () => {
    const exitSpy = spyOn(process, "exit").mockImplementation(
      (() => undefined) as never,
    );
    const output = await captureOutput(() => main([tempDir()]));
    expect(output).toContain("Error writing file:");
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
