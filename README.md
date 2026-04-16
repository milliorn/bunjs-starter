# bun-starter

[![CodeQL](https://github.com/milliorn/bunjs-starter/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/milliorn/bunjs-starter/actions/workflows/github-code-scanning/codeql)
[![Labeler](https://github.com/milliorn/bunjs-starter/actions/workflows/label.yml/badge.svg)](https://github.com/milliorn/bunjs-starter/actions/workflows/label.yml)

This is a starter repo for Bun.js, a JavaScript runtime, bundler, and toolkit.
It is designed to be simple, fast, and easy to use for developers.

## Table of Contents

1. [Bun.js Website](#bunjs-website)
2. [Install Bun.js](#install-bunjs)
3. [Quickstart](#quickstart)
4. [Run a file](#run-a-file)
5. [Running modes and environment](#running-modes-and-environment)

- [Watch mode (docs)](https://bun.sh/docs/quickstart#watch-mode)
- [Hot Mode](#hot-mode)
- [Environment Variables](#environment-variables)

1. [Routes](#routes)
2. [File I/O](#file-io)
3. [Bun X](#bun-x)
4. [Bundler Examples](#bundler-examples)
5. [Bun Test](#bun-test)
6. [Bundler Examples](#bundler-examples)
7. [CLI Usage](#cli-usage)

## Project Structure & Tests

Project structure:

```bash
src/
  cli.tsx
  index.ts
  random.ts
readFile.ts
writeFile.ts
server.ts
__tests__/
  cli.test.tsx
  index.test.ts
  readFile.test.ts
  server.test.ts
  writeFile.test.ts
```

Run all tests:

```bash
bun test
```

Test coverage includes CLI, file I/O, server routes, and utilities.

## CLI Usage

The CLI now supports argument parsing and help output. Example:

```bash
bun run src/cli.tsx 5 10
```

Prints a random number between 5 and 10. For help:

```bash
bun run src/cli.tsx --help
```

Shows usage instructions.

## Bun.js Website

<https://bun.sh/>

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

## Install project dependencies

After Bun is installed and you're in the project root, install dependencies with:

```bash
bun install
```

This will install packages from `package.json` and generate `bun.lockb`.

To add a dependency or dev-dependency use:

```bash
bun add axios
bun add -d bun-types
```

To run scripts defined in `package.json` use `bun run <script>` (for example
`bun run start`) and use `bun test` to run the built-in test runner.

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

## Running modes and environment

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

Bun does not automatically load a `.env` file. If you want to store local
environment variables in a `.env` file, create it in the project root and
load it with your preferred loader, or export variables in your shell. In Bun
you can access environment variables with `Bun.env` or `process.env`.

To use an environment variable for the server port, you can read it like this:

```ts
port: process.env.PORT || Bun.env.PORT || 3001;
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

### writeFile.ts

```ts
export async function writeTextFile(
  filename: string,
  content: string,
): Promise<void> {
  if (!filename) throw new Error("Filename is required.");
  if (!content) throw new Error("Content is required.");
  await Bun.write(filename, content);
}

if (import.meta.main) {
  const filename = process.argv[2] || "scratchFile.txt";
  const content = process.argv[3] || "Hello World!";
  writeTextFile(filename, content)
    .then(() => console.log(`File "${filename}" written successfully.`))
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
}
```

Run:

```bash
bun run writeFile.ts scratchFile.txt "Hello World!"
```

### readFile.ts

```ts
export async function readTextFile(filename: string): Promise<string> {
  const readFile = Bun.file(filename);
  if (!(await readFile.exists())) {
    throw new Error(`File "${filename}" does not exist.`);
  }
  return await readFile.text();
}

if (import.meta.main) {
  const filename = process.argv[2] || "writeFile.txt";
  readTextFile(filename)
    .then((text) => console.log(text))
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
}
```

Run:

```bash
bun run readFile.ts writeFile.txt
```

Both scripts now provide error handling and CLI usage.

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

## Bundler Examples

See [Bundler](https://bun.sh/docs/bundler) for more details.

Bun.js comes with a built-in bundler. To bundle your code, create a file called `index.ts` in the `src` folder and add:

```ts
export async function fetchUser(username: string): Promise<any> {
  const res = await fetch(`https://api.github.com/users/${username}`);
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return await res.json();
}

async function main(args: string[] = process.argv.slice(2)) {
  const username = args[0] || "milliorn";
  const data = await fetchUser(username);
  console.log("User data:", data);
}

if (require.main === module) {
  main();
}
```

Bundle with:

```bash
bun build src/index.ts --outfile dist/bundle.js
```

## Random Number Utility

Create a file called `random.ts` in `src`:

```ts
export function random(min: number = 0, max: number = 100): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
```

Use it in your CLI:

```ts
import { random } from "./random.ts";

function main(args: string[] = process.argv.slice(2)) {
  let min = Number(args[0]) || 0;
  let max = Number(args[1]) || 100;
  console.log(`Your random number is ${random(min, max)}`);
}

main(process.argv.slice(2));
```
