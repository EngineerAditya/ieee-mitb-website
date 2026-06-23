import { describe, expect, it } from "vitest";
import { optionalUrl } from "@/lib/validations/common";
import { safeUrl } from "@/lib/utils";

const DANGEROUS = [
  "javascript:alert(1)",
  "JavaScript:alert(1)",
  "  javascript:alert(1)",
  "data:text/html,<script>alert(1)</script>",
  "vbscript:msgbox(1)",
  "//evil.com",
];

describe("optionalUrl (write-time validation)", () => {
  it("rejects dangerous/non-http(s) schemes", () => {
    for (const u of DANGEROUS) {
      expect(optionalUrl.safeParse(u).success, u).toBe(false);
    }
  });
  it("accepts https and same-origin relative paths", () => {
    expect(optionalUrl.parse("https://example.com/x")).toBe(
      "https://example.com/x",
    );
    expect(optionalUrl.parse("/logo.png")).toBe("/logo.png");
  });
  it("normalizes empty to null", () => {
    expect(optionalUrl.parse("")).toBeNull();
  });
});

describe("safeUrl (render-time guard)", () => {
  it("strips dangerous schemes", () => {
    for (const u of DANGEROUS) expect(safeUrl(u)).toBeUndefined();
  });
  it("passes http(s) and relative", () => {
    expect(safeUrl("https://x.com")).toBe("https://x.com");
    expect(safeUrl("/sbPhotos/a.jpeg")).toBe("/sbPhotos/a.jpeg");
  });
  it("allows mailto only when opted in", () => {
    expect(safeUrl("mailto:a@b.com")).toBeUndefined();
    expect(safeUrl("mailto:a@b.com", true)).toBe("mailto:a@b.com");
  });
  it("handles nullish", () => {
    expect(safeUrl(null)).toBeUndefined();
    expect(safeUrl(undefined)).toBeUndefined();
  });
});
