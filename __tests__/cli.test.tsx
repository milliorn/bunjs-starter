import { describe, it, expect } from "bun:test";
import { main } from "../src/cli.tsx";
import { captureOutput } from "./helpers/captureOutput.ts";

describe("cli.tsx", () => {
  it("prints a random number with no args", async () => {
    const output = await captureOutput(() => main([]));
    expect(output).toMatch(/Your random number is \d+/);
  });

  it("prints a random number in range", async () => {
    const output = await captureOutput(() => main(["5", "10"]));
    const match = output.match(/Your random number is (\d+)/);
    expect(match).not.toBeNull();
    const num = Number(match?.[1]);
    expect(num).toBeGreaterThanOrEqual(5);
    expect(num).toBeLessThanOrEqual(10);
  });

  it("shows help with --help", async () => {
    const output = await captureOutput(() => main(["--help"]));
    expect(output).toMatch(/Usage:/);
    expect(output).toMatch(/Arguments:/);
  });

  it("shows error for invalid min", async () => {
    const output = await captureOutput(() => main(["foo", "10"]));
    expect(output).toMatch(/min must be a number/);
  });

  it("shows error for invalid max", async () => {
    const output = await captureOutput(() => main(["5", "bar"]));
    expect(output).toMatch(/max must be a number/);
  });

  it("shows error if min > max", async () => {
    const output = await captureOutput(() => main(["10", "5"]));
    expect(output).toMatch(/min cannot be greater than max/);
  });
});
