export async function writeTextFile(
  filename: string,
  content: string,
): Promise<void> {
  if (!filename) throw new Error("Filename is required.");
  if (!content) throw new Error("Content is required.");

  await Bun.write(filename, content);
}

// CLI usage
if (import.meta.main) {
  const filename = process.argv[2] || "scratchFile.txt";
  const content = process.argv[3] || "Hellow World!";

  writeTextFile(filename, content)
    .then(() => {
      console.log(`File "${filename}" written successfully.`);
    })
    .catch((error) => {
      console.error(`Error writing file: ${error.message}`);
      process.exit(1);
    });
}
