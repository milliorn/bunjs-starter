import { afterEach, describe, expect, it } from "bun:test";
import { fetchUser, main, type GitHubUser } from "../src/index.ts";
import { captureOutput } from "./helpers/captureOutput.ts";

const originalFetch = globalThis.fetch;

const milliornUser: GitHubUser = {
  login: "milliorn",
  id: 1,
  name: null,
  company: null,
  blog: "",
  location: null,
  email: null,
  bio: null,
  public_repos: 0,
  followers: 0,
  following: 0,
  created_at: "2020-01-01T00:00:00Z",
};

afterEach(() => {
  globalThis.fetch = originalFetch;
});

let lastFetchUrl: string | undefined;

function mockFetchOnce(response: Response) {
  globalThis.fetch = (async (url: string) => {
    lastFetchUrl = url;
    return response.clone();
  }) as unknown as typeof fetch;
}

describe("fetchUser", () => {
  it("returns parsed JSON on a successful response", async () => {
    mockFetchOnce(
      new Response(JSON.stringify(milliornUser), { status: 200 }),
    );
    const user = await fetchUser("milliorn");
    expect(user).toEqual(milliornUser);
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
    expect(lastFetchUrl).toBe("https://api.github.com/users/octocat");
    expect(output).toMatch(/User data:/);
    expect(output).toMatch(/octocat/);
  });

  it("defaults to the milliorn username when no argument is given", async () => {
    mockFetchOnce(
      new Response(JSON.stringify({ login: "milliorn" }), { status: 200 }),
    );
    const output = await captureOutput(() => main([]));
    expect(lastFetchUrl).toBe("https://api.github.com/users/milliorn");
    expect(output).toMatch(/User data:/);
    expect(output).toMatch(/milliorn/);
  });

  it("prints an error when the fetch fails", async () => {
    mockFetchOnce(new Response(null, { status: 500, statusText: "Server Error" }));
    const output = await captureOutput(() => main(["milliorn"]));
    expect(output).toMatch(/Error fetching user:/);
    expect(output).toMatch(/Error:/);
  });
});
