import { describe, it, expect } from "bun:test";
import { main } from "../src/cli.tsx";

function captureOutput(fn: () => void): string {
  const originalLog = console.log;
  const originalError = console.error;
  let output = "";
  console.log = (...args: any[]) => { output += args.join(" ") + "\n"; };
  console.error = (...args: any[]) => { output += args.join(" ") + "\n"; };
  try {
    fn();
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
  return output;
}

describe("cli.tsx", () => {
  it("prints a random number with no args", () => {
    const output = captureOutput(() => main([]));
    expect(output).toMatch(/Your random number is \d+/);
  });

  it("prints a random number in range", () => {
    const output = captureOutput(() => main(["5", "10"]));
    const match = output.match(/Your random number is (\d+)/);
    expect(match).not.toBeNull();
    const num = Number(match?.[1]);
    expect(num).toBeGreaterThanOrEqual(5);
    expect(num).toBeLessThanOrEqual(10);
  });

  it("shows help with --help", () => {
    const output = captureOutput(() => main(["--help"]));
    expect(output).toMatch(/Usage:/);
    expect(output).toMatch(/Arguments:/);
  });

  it("shows error for invalid min", () => {
    const output = captureOutput(() => main(["foo", "10"]));
    expect(output).toMatch(/min must be a number/);
  });

  it("shows error for invalid max", () => {
    const output = captureOutput(() => main(["5", "bar"]));
    expect(output).toMatch(/max must be a number/);
  });

  it("shows error if min > max", () => {
    const output = captureOutput(() => main(["10", "5"]));
    expect(output).toMatch(/min cannot be greater than max/);
  });
});
