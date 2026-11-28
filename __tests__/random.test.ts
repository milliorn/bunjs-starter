import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";
import { random } from "../src/random.ts";

afterEach(() => {
  mock.restore();
});

describe("random", () => {
  it("defaults to an integer between 0 and 100", () => {
    for (let i = 0; i < 1000; i++) {
      const n = random();
      expect(Number.isInteger(n)).toBe(true);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(100);
    }
  });

  it("stays within a custom range", () => {
    for (let i = 0; i < 1000; i++) {
      const n = random(5, 10);
      expect(Number.isInteger(n)).toBe(true);
      expect(n).toBeGreaterThanOrEqual(5);
      expect(n).toBeLessThanOrEqual(10);
    }
  });

  it("returns min when min equals max", () => {
    expect(random(7, 7)).toBe(7);
  });

  it("includes the lower bound", () => {
    spyOn(Math, "random").mockReturnValue(0);
    expect(random()).toBe(0);
    expect(random(5, 10)).toBe(5);
  });

  it("includes the upper bound", () => {
    spyOn(Math, "random").mockReturnValue(0.9999999999);
    expect(random()).toBe(100);
    expect(random(5, 10)).toBe(10);
  });
});
