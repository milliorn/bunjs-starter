/// <reference types="bun-types" />

import { afterEach, beforeEach, describe, expect, it, spyOn } from "bun:test";
import { handleRequest, startServer } from "../server.ts";
import { captureOutput } from "./helpers/captureOutput.ts";

type Server = ReturnType<typeof Bun.serve>;

const running: Server[] = [];
const originalPort = process.env.PORT;

afterEach(async () => {
  await Promise.all(running.splice(0).map((server) => server.stop(true)));
  if (originalPort === undefined) delete process.env.PORT;
  else process.env.PORT = originalPort;
});

function request(path: string, init?: RequestInit): Response {
  return handleRequest(new Request(`http://localhost${path}`, init));
}

describe("handleRequest", () => {
  it("GET / returns Hello World with correct content-type", async () => {
    const res = request("/");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/html; charset=utf-8");
    expect(await res.text()).toBe("Hello World!");
  });

  it("GET /json returns JSON with correct content-type", async () => {
    const res = request("/json");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );
    expect(await res.json()).toEqual({ hello: "world" });
  });

  it("GET /unknown returns 404 with correct content-type", async () => {
    const res = request("/unknown");
    expect(res.status).toBe(404);
    expect(res.headers.get("content-type")).toBe("text/plain; charset=utf-8");
    expect(await res.text()).toBe("Not Found");
  });

  it("POST / returns Hello World (method-agnostic routing)", async () => {
    const res = request("/", { method: "POST" });
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Hello World!");
  });
});

describe("startServer", () => {
  let exitSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    exitSpy = spyOn(process, "exit").mockImplementation(
      (() => undefined) as never,
    );
  });

  afterEach(() => {
    exitSpy.mockRestore();
  });

  it("serves requests on the given port and logs the address", async () => {
    const output = await captureOutput(() => {
      const server = startServer(0);
      if (server) running.push(server);
    });
    expect(exitSpy).not.toHaveBeenCalled();
    expect(running).toHaveLength(1);
    const [server] = running;
    expect(output).toContain("Hello via Bun!");
    expect(output).toContain(`Listening on http://localhost:${server.port}`);

    const res = await fetch(new URL("/json", server.url));
    expect(await res.json()).toEqual({ hello: "world" });
  });

  it("reads the port from the PORT env variable by default", async () => {
    process.env.PORT = "4321";
    const serveSpy = spyOn(Bun, "serve").mockImplementation(
      () => ({ port: 4321 }) as ReturnType<typeof Bun.serve>,
    );
    try {
      await captureOutput(() => {
        startServer();
      });
      expect(exitSpy).not.toHaveBeenCalled();
      expect(serveSpy).toHaveBeenCalledTimes(1);
      expect(serveSpy.mock.calls[0]?.[0]).toMatchObject({ port: 4321 });
    } finally {
      serveSpy.mockRestore();
    }
  });

  it("logs and exits with code 1 when Bun.serve throws", async () => {
    const serveSpy = spyOn(Bun, "serve").mockImplementation(() => {
      throw new Error("boom");
    });
    try {
      const output = await captureOutput(() => {
        const server = startServer(3001);
        if (server) running.push(server);
      });
      expect(output).toContain("Failed to start server: Error: boom");
      expect(exitSpy).toHaveBeenCalledWith(1);
    } finally {
      serveSpy.mockRestore();
    }
  });
});
