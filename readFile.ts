export async function readTextFile(filename: string): Promise<string> {
  const readFile = Bun.file(filename);
  if (!(await readFile.exists())) {
    throw new Error(`File \"${filename}\" does not exist.`);
  }
  return await readFile.text();
}

// CLI usage
if (import.meta.main) {
  const filename = process.argv[2] || "writeFile.txt";
  readTextFile(filename)
    .then((text) => console.log(text))
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
}
