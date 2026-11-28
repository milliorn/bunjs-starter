export function handleRequest(req: Request): Response {
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
}

export function startServer(
  port = parseInt(process.env.PORT || "3001"),
): ReturnType<typeof Bun.serve> | undefined {
  console.log("Hello via Bun!");

  try {
    const server = Bun.serve({ port, fetch: handleRequest });
    console.log(`Listening on http://localhost:${server.port}`);
    return server;
  } catch (error) {
    console.error(`Failed to start server: ${error}`);
    process.exit(1);
  }
}

if (import.meta.main) startServer();
