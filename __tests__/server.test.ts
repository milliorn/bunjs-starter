/// <reference types="bun-types" />

import { describe, it, expect, beforeAll, afterAll } from "bun:test";

let server: ReturnType<typeof Bun.serve>;
const TEST_PORT = 3002;
const BASE_URL = `http://localhost:${TEST_PORT}`;

beforeAll(async () => {
  // Start server for testing on a different port
  server = Bun.serve({
    port: TEST_PORT,
    fetch(req) {
      const url = new URL(req.url);

      if (url.pathname === "/") {
        return new Response("Hello World!", {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      } else if (url.pathname === "/json") {
        return new Response(JSON.stringify({ hello: "world" }), {
          headers: { "content-type": "application/json; charset=utf-8" },
        });
      }

      return new Response("Not Found", {
        status: 404,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    },
  });

  // Give server time to start
  await new Promise((resolve) => setTimeout(resolve, 100));
});

afterAll(() => {
  server.stop();
});

describe("server routes", () => {
  it("GET / returns Hello World with correct content-type", async () => {
    const res = await fetch(`${BASE_URL}/`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/html; charset=utf-8");
    const text = await res.text();
    expect(text).toBe("Hello World!");
  });

  it("GET /json returns JSON with correct content-type", async () => {
    const res = await fetch(`${BASE_URL}/json`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );
    const json = await res.json();
    expect(json).toEqual({ hello: "world" });
  });

  it("GET /unknown returns 404 with correct content-type", async () => {
    const res = await fetch(`${BASE_URL}/unknown`);
    expect(res.status).toBe(404);
    expect(res.headers.get("content-type")).toBe("text/plain; charset=utf-8");
    const text = await res.text();
    expect(text).toBe("Not Found");
  });

  it("POST / returns Hello World (method-agnostic routing)", async () => {
    const res = await fetch(`${BASE_URL}/`, { method: "POST" });
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toBe("Hello World!");
  });
});
