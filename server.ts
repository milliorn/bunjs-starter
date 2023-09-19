console.log("Hello via Bun!");

const server = Bun.serve({
  port: process.env.PORT || 3001,
  fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/") {
      return new Response("Hello World!");
    } else if (url.pathname === "/json") {
      return new Response(JSON.stringify({ hello: "world" }), {
        headers: { "content-type": "application/json" },
      });
    } else {
      return new Response("Not Found", { status: 404 });
    }
  },
});

console.log(`Listening on http://localhost:${server.port}`);
