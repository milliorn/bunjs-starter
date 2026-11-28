export async function readTextFile(filename: string): Promise<string> {
  const readFile = Bun.file(filename);
  if (!(await readFile.exists())) {
    throw new Error(`File \"${filename}\" does not exist.`);
  }
  return await readFile.text();
}

export function main(args: string[] = process.argv.slice(2)): Promise<void> {
  const filename = args[0] || "writeFile.txt";
  return readTextFile(filename)
    .then((text) => console.log(text))
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
}

// One line on purpose so Bun counts it as covered; __tests__/entrypoints.test.ts runs it for real.
if (import.meta.main) main();
