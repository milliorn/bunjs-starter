const readFlie = Bun.file('writeFile.txt');
console.log(await readFlie.text());