/// <reference types="bun-types" />

import { afterEach, describe, expect, it } from "bun:test";
import { fetchUser, main } from "../src/index.ts";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

function captureOutput(fn: () => Promise<void> | void): Promise<string> | string {
  const originalLog = console.log;
  const originalError = console.error;
  let output = "";
  const format = (args: any[]) =>
    args
      .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)))
      .join(" ");
  console.log = (...args: any[]) => {
    output += format(args) + "\n";
  };
  console.error = (...args: any[]) => {
    output += format(args) + "\n";
  };
  const restore = () => {
    console.log = originalLog;
    console.error = originalError;
  };
  const result = fn();
  if (result instanceof Promise) {
    return result.then(() => output).finally(restore);
  }
  restore();
  return output;
}

function mockFetchOnce(response: Response) {
  globalThis.fetch = (() => Promise.resolve(response)) as typeof fetch;
}

describe("fetchUser", () => {
  it("returns parsed JSON on a successful response", async () => {
    mockFetchOnce(
      new Response(JSON.stringify({ login: "milliorn" }), { status: 200 }),
    );
    const user = await fetchUser("milliorn");
    expect(user).toEqual({ login: "milliorn" });
  });

  it("throws on a non-ok response", async () => {
    mockFetchOnce(new Response(null, { status: 404, statusText: "Not Found" }));
    await expect(fetchUser("does-not-exist")).rejects.toThrow(
      "GitHub API error: 404 Not Found",
    );
  });
});

describe("main", () => {
  it("shows help with --help", async () => {
    const output = await captureOutput(() => main(["--help"]));
    expect(output).toMatch(/Usage:/);
    expect(output).toMatch(/Arguments:/);
  });

  it("shows help with -h", async () => {
    const output = await captureOutput(() => main(["-h"]));
    expect(output).toMatch(/Usage:/);
  });

  it("fetches and prints user data for a given username", async () => {
    mockFetchOnce(
      new Response(JSON.stringify({ login: "octocat" }), { status: 200 }),
    );
    const output = await captureOutput(() => main(["octocat"]));
    expect(output).toMatch(/User data:/);
    expect(output).toMatch(/octocat/);
  });

  it("prints an error when the fetch fails", async () => {
    mockFetchOnce(new Response(null, { status: 500, statusText: "Server Error" }));
    const output = await captureOutput(() => main(["milliorn"]));
    expect(output).toMatch(/Error fetching user:/);
    expect(output).toMatch(/Error:/);
  });
});
