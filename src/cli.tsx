import { random } from './random.ts';

function printHelp() {
	console.log(`\nUsage: bun run src/cli.tsx [min] [max]\n`);
	console.log("Generates a random number between min and max (inclusive).\n");
	console.log("Arguments:");
	console.log("  min   Minimum value (default: 0)");
	console.log("  max   Maximum value (default: 100)\n");
}

export function main(args: string[] = process.argv.slice(2)) {
	if (args.includes("--help") || args.includes("-h")) {
		printHelp();
		return;
	}

	let min = 0;
	let max = 100;
	if (args.length > 0) {
		min = Number(args[0]);
		if (isNaN(min)) {
			console.error("Error: min must be a number.");
			printHelp();
			return;
		}
	}
	if (args.length > 1) {
		max = Number(args[1]);
		if (isNaN(max)) {
			console.error("Error: max must be a number.");
			printHelp();
			return;
		}
	}
	if (min > max) {
		console.error("Error: min cannot be greater than max.");
		printHelp();
		return;
	}

	const value = random(min, max);
	console.log(`Your random number is ${value}`);
}

if (import.meta.main) {
	main();
}
