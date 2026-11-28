/// <reference types="bun-types" />

import { describe, expect, it } from "bun:test";
import { join } from "node:path";
import { REPO_ROOT, useTempDir } from "./helpers/fs.ts";

const SPAWN_TIMEOUT = 10_000;
const TEST_TIMEOUT = 15_000;

const tempDir = useTempDir("entry");

function run(args: string[], cwd = REPO_ROOT) {
  const proc = Bun.spawnSync([process.execPath, ...args], {
    cwd,
    timeout: SPAWN_TIMEOUT,
  });
  return {
    exitCode: proc.exitCode,
    stdout: proc.stdout.toString(),
    stderr: proc.stderr.toString(),
  };
}

describe("entry points run main when executed directly", () => {
  it("readFile.ts prints writeFile.txt", () => {
    const { exitCode, stdout } = run(["readFile.ts"]);
    expect(exitCode).toBe(0);
    expect(stdout.trim()).toBe("Hello World!");
  }, TEST_TIMEOUT);

  it("readFile.ts exits 1 for a missing file", () => {
    const { exitCode, stderr } = run(["readFile.ts", join(tempDir(), "missing.txt")]);
    expect(exitCode).toBe(1);
    expect(stderr).toContain("does not exist");
  }, TEST_TIMEOUT);

  it("writeFile.ts writes the given file", async () => {
    const path = join(tempDir(), "out.txt");
    const { exitCode, stdout } = run([
      join(REPO_ROOT, "writeFile.ts"),
      path,
      "Entry text",
    ]);
    expect(exitCode).toBe(0);
    expect(stdout).toContain(`File "${path}" written successfully.`);
    expect(await Bun.file(path).text()).toBe("Entry text");
  }, TEST_TIMEOUT);

  it("src/cli.tsx prints a number", () => {
    const { exitCode, stdout } = run(["src/cli.tsx", "7", "7"]);
    expect(exitCode).toBe(0);
    expect(stdout).toContain("Your random number is 7");
  }, TEST_TIMEOUT);

  it("src/index.ts prints help without touching the network", () => {
    const { exitCode, stdout } = run(["src/index.ts", "--help"]);
    expect(exitCode).toBe(0);
    expect(stdout).toContain("Usage: bun run src/index.ts [username]");
  }, TEST_TIMEOUT);

  it("server.ts starts listening and serves requests", async () => {
    const proc = Bun.spawn([process.execPath, "server.ts"], {
      cwd: REPO_ROOT,
      env: { ...process.env, PORT: "0" },
      stdout: "pipe",
      stderr: "pipe",
    });
    const timer = setTimeout(() => proc.kill(), SPAWN_TIMEOUT);
    try {
      const reader = proc.stdout.getReader();
      const decoder = new TextDecoder();
      let text = "";
      let match: RegExpMatchArray | null = null;
      while (!(match = text.match(/Listening on (\S+)\n/))) {
        const { value, done } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
      }
      if (!match) {
        const stderr = await new Response(proc.stderr).text();
        throw new Error(
          `server.ts never logged its address.\nstdout: ${text}\nstderr: ${stderr}`,
        );
      }
      const res = await fetch(new URL("/json", match[1]));
      expect(await res.json()).toEqual({ hello: "world" });
    } finally {
      clearTimeout(timer);
      proc.kill();
      await proc.exited;
    }
  }, TEST_TIMEOUT);
});
