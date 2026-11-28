/// <reference types="bun-types" />

import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const REPO_ROOT = join(import.meta.dir, "..");

let dir: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "bunjs-starter-entry-"));
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

function run(args: string[], cwd = REPO_ROOT) {
  const proc = Bun.spawnSync([process.execPath, ...args], { cwd });
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
  });

  it("readFile.ts exits 1 for a missing file", () => {
    const { exitCode, stderr } = run(["readFile.ts", join(dir, "missing.txt")]);
    expect(exitCode).toBe(1);
    expect(stderr).toContain("does not exist");
  });

  it("writeFile.ts writes the given file", async () => {
    const path = join(dir, "out.txt");
    const { exitCode, stdout } = run([
      join(REPO_ROOT, "writeFile.ts"),
      path,
      "Entry text",
    ]);
    expect(exitCode).toBe(0);
    expect(stdout).toContain(`File "${path}" written successfully.`);
    expect(await Bun.file(path).text()).toBe("Entry text");
  });

  it("src/cli.tsx prints a number", () => {
    const { exitCode, stdout } = run(["src/cli.tsx", "7", "7"]);
    expect(exitCode).toBe(0);
    expect(stdout).toContain("Your random number is 7");
  });

  it("src/index.ts prints help without touching the network", () => {
    const { exitCode, stdout } = run(["src/index.ts", "--help"]);
    expect(exitCode).toBe(0);
    expect(stdout).toContain("Usage: bun run src/index.ts [username]");
  });

  it("server.ts starts listening and serves requests", async () => {
    const proc = Bun.spawn([process.execPath, "server.ts"], {
      cwd: REPO_ROOT,
      env: { ...process.env, PORT: "0" },
      stdout: "pipe",
    });
    try {
      const reader = proc.stdout.getReader();
      const decoder = new TextDecoder();
      let text = "";
      let match: RegExpMatchArray | null = null;
      while (!(match = text.match(/Listening on (\S+)\n/))) {
        const { value, done } = await reader.read();
        if (done) break;
        text += decoder.decode(value);
      }
      expect(match?.[1]).toBeDefined();
      const res = await fetch(new URL("/json", match?.[1]));
      expect(await res.json()).toEqual({ hello: "world" });
    } finally {
      proc.kill();
      await proc.exited;
    }
  });
});
