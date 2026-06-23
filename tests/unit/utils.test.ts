import { describe, expect, it } from "vitest";
import {
  cn,
  formatDate,
  slugify,
  toDateInput,
  toDateTimeLocal,
} from "@/lib/utils";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Hello World!")).toBe("hello-world");
    expect(slugify("  AI/ML Workshop 2026  ")).toBe("ai-ml-workshop-2026");
  });
  it("strips apostrophes", () => {
    expect(slugify("Don't Panic")).toBe("dont-panic");
    expect(slugify("MIT B'luru")).toBe("mit-bluru");
  });
});

describe("cn", () => {
  it("joins truthy values only", () => {
    expect(cn("a", false, null, "b", undefined)).toBe("a b");
    expect(cn()).toBe("");
  });
});

describe("date formatting", () => {
  it("formatDate renders a human date", () => {
    expect(formatDate("2026-06-21")).toContain("2026");
  });
  it("toDateInput returns YYYY-MM-DD or empty", () => {
    expect(toDateInput("2026-06-21T10:00:00")).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(toDateInput(null)).toBe("");
    expect(toDateInput("not-a-date")).toBe("");
  });
  it("toDateTimeLocal returns empty for nullish", () => {
    expect(toDateTimeLocal(null)).toBe("");
    expect(toDateTimeLocal(undefined)).toBe("");
    expect(toDateTimeLocal("2026-06-21T10:00:00")).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
    );
  });
});
