/// <reference types="bun-types" />

import { afterEach, describe, expect, it, spyOn } from "bun:test";
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
  it("serves requests on the given port and logs the address", async () => {
    const output = await captureOutput(() => {
      const server = startServer(0);
      if (server) running.push(server);
    });
    expect(running).toHaveLength(1);
    const [server] = running;
    expect(output).toContain("Hello via Bun!");
    expect(output).toContain(`Listening on http://localhost:${server.port}`);

    const res = await fetch(`http://localhost:${server.port}/json`);
    expect(await res.json()).toEqual({ hello: "world" });
  });

  it("reads the port from the PORT env variable by default", async () => {
    process.env.PORT = "0";
    await captureOutput(() => {
      const server = startServer();
      if (server) running.push(server);
    });
    expect(running).toHaveLength(1);
    const [server] = running;
    expect(server.port).toBeGreaterThan(0);
  });

  it("logs and exits with code 1 when the port is taken", async () => {
    const blocker = Bun.serve({ port: 0, fetch: () => new Response() });
    running.push(blocker);
    const exitSpy = spyOn(process, "exit").mockImplementation(
      (() => undefined) as never,
    );
    try {
      const output = await captureOutput(() => {
        const server = startServer(blocker.port);
        if (server) running.push(server);
      });
      expect(output).toContain("Failed to start server");
      expect(exitSpy).toHaveBeenCalledWith(1);
    } finally {
      exitSpy.mockRestore();
    }
  });
});
