# bun-starter

This is a starter repo for Bun.js, a modern web framework for Node.js. Bun.js is a JavaScript runtime, bundler, toolkit. It is designed to be a simple, fast, and easy to use tool for JavaScript developers.

## Bun.js Website

https://bun.sh/

## Install Bun.js

```bash
curl -fsSL https://bun.sh/install | bash
```

Supported on macOS, Linux, and WSL. Windows is not supported yet. See [Installation](https://bun.sh/#/docs/installation) for more details.

When you install Bun.js, you will see something like this:

```bash
bun was installed successfully to ~/.bun/bin/bun

Added "~/.bun/bin" to $PATH in "~/.bashrc"

To get started, run:

  source /home/milliorn/.bashrc
  bun --help
```

To test the installation run:

```bash
bun --help
```

and to confirm you can run:

```bash
bun --version
```

## Quickstart

See [Quickstart](https://bun.sh/docs/quickstart) for more details.

Run `bun init` to scaffold a new project. It's an interactive tool; for this tutorial, just press enter to accept the default answer for each prompt.

```bash
bun init helps you get started with a minimal project and tries to guess sensible defaults. Press ^C anytime to quit

package name (bun-starter):
entry point (index.ts):

Done! A package.json file was saved in the current directory.
 + index.ts
 + tsconfig.json (for editor auto-complete)

To get started, run:
  bun run index.ts
```

## Run a file

See [Run a script](https://bun.sh/docs/quickstart#run-a-script) for more details.

In your cli in the root of your project run:

```bash
bun run index.ts
```

Now, open `package.json` in your editor. You can add this to your scripts:

```json
{
  "scripts": {
    "start": "bun run index.ts"
  }
}
```

Then run it with bun run start.

```bash
bun run start
```

Now, open `index.ts` in your editor and paste the following code:

```ts
console.log("Hello via Bun!");

const server = Bun.serve({
  port: 3000,
  fetch(req) {
    return new Response("Bun!");
  },
});

console.log(`Listening on http://localhost:${server.port}`);
```

Now, open `http://localhost:3000` in your browser. You should see "Bun!".

## Watch mode

See [Watch mode](https://bun.sh/docs/quickstart#watch-mode) for more details.

In your cli in the root of your project run:

```bash
bun run --watch index.ts
```

## Hot Mode

See [Hot Mode](https://bun.sh/docs/quickstart#hot-mode) for more details.

Use `bun --hot` to enable hot reloading when executing code with Bun.

```bash
bun run --hot index.ts
```

## Environment variables

See [Environment variables](https://bun.sh/docs/quickstart#environment-variables) for more details.

Bun uses the dotenv package to manage environment variables. Create a `.env` file in the root of your project:

```bash
touch .env
```

Add the following to your `.env` file:

```bash
PORT=3000
```

Now, open `index.ts` in your editor and replace the port with the following:

```ts
port: process.env.PORT || 3001;
```

Should look like this:

```ts
console.log("Hello via Bun!");

const server = Bun.serve({
  port: process.env.PORT || 3001,
  fetch(req) {
    return new Response("Bun run!");
  },
});

console.log(`Listening on http://localhost:${server.port}`);
```

Alternatively, you can use the `bun` instead of `process.env`:

```ts
port: Bun.env.PORT || 3001;
```

## Routes

We can create simple routes:

```ts
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
```

Now, if you go to `http://localhost:3001/json` you should see:

```json
{ "hello": "world" }
```

## Bun X

`bunx <package>` is a command line tool that allows you to run a package without installing it, similar to `npx`.

```bash
bunx cowsay "hello"
```

```bash
 _______
< hello >
 -------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

## File I/O

See [File I/O](https://bun.sh/docs/api/file-io) for more details.

```ts

```
