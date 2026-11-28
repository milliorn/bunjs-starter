export async function writeTextFile(
  filename: string,
  content: string,
): Promise<void> {
  if (!filename) throw new Error("Filename is required.");
  if (!content) throw new Error("Content is required.");

  await Bun.write(filename, content);
}

export function main(args: string[] = process.argv.slice(2)): Promise<void> {
  const filename = args[0] || "scratchFile.txt";
  const content = args[1] || "Hello World!";

  return writeTextFile(filename, content)
    .then(() => {
      console.log(`File "${filename}" written successfully.`);
    })
    .catch((error) => {
      console.error(`Error writing file: ${error.message}`);
      process.exit(1);
    });
}

if (import.meta.main) main();
