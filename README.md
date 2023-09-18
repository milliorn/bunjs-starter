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
entry point (server.ts):

Done! A package.json file was saved in the current directory.
 + server.ts
 + tsconfig.json (for editor auto-complete)

To get started, run:
  bun run server.ts
```

## Run a file

See [Run a script](https://bun.sh/docs/quickstart#run-a-script) for more details.

In your cli in the root of your project run:

```bash
bun run server.ts
```

Now, open `package.json` in your editor. You can add this to your scripts:

```json
{
  "scripts": {
    "start": "bun run server.ts"
  }
}
```

Then run it with bun run start.

```bash
bun run start
```

Now, open `server.ts` in your editor and paste the following code:

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
bun run --watch server.ts
```

## Hot Mode

See [Hot Mode](https://bun.sh/docs/quickstart#hot-mode) for more details.

Use `bun --hot` to enable hot reloading when executing code with Bun.

```bash
bun run --hot server.ts
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

Now, open `server.ts` in your editor and replace the port with the following:

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

Make a new file called `writeFile.ts` or whatever you want it to be in the root of your project and add the following text:

```ts
const dummyData = "Hello World!";

await Bun.write("writeFile.txt", dummyData);
```

If you don't use `writeFile.ts` as the name of the file, make sure to change the name in the parameter of `Bun.write()`.

Now you can run the code with:

```bash
bun run writeFile.ts
```

You should see a new file called `writeFile.txt` in the root of your project with the text "Hello World!".

To read the file, make a new file called `readFile.ts` or whatever you want it to be in the root of your project and add the following text:

```ts
const readFlie = Bun.file("writeFile.txt");
console.log(await readFlie.text());
```

```bash
bun-starter$ bun run readFile.ts
[3.24ms] ".env"
Hello World!
```

## bun test

See [bun test](https://bun.sh/docs/cli/test) for more details.

Bun.js comes with a built-in test runner. To run tests, create a file called `index.test.ts` or whatever you want it to be in the root of your project and add the following text:

```ts
import { describe, expect, test, beforeAll } from "bun:test";

describe("math", () => {
  test("logic", () => {
    expect(1).toBe(1);
  });
});
```

Now you can run the code with:

```bash
bun test
```

You should see:

```bash

  math
    ✓ logic

  1 passing (1ms)
```

## Bundler

See [Bundler](https://bun.sh/docs/bundler) for more details.

Bun.js comes with a built-in bundler. To bundle your code, create a file called `index.ts` or whatever you want it to be in `src` folder of your project and add the following text:

```ts
import axios from "axios";

async function fetchUser(user: string) {
  try {
    const response = await axios.get(`https://api.github.com/users/${user}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

fetchUser("milliorn")
  .then((data) => console.log("User data:", data))
  .catch((error) => console.error("Error:", error));
```

Now you can bundle the code with:

```bash
bun build src/index.ts --outfile dist/bundle.js
```

You should see a new file called `bundle.js` in the `dist` folder of your project with the bundled code.
