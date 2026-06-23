import { describe, expect, it } from "vitest";
import {
  eventsQuerySchema,
  flattenSearchParams,
  listQuerySchema,
} from "@/lib/validations/common";
import { eventInputSchema } from "@/lib/validations/event";
import { articleInputSchema } from "@/lib/validations/article";
import { contactMessageInputSchema } from "@/lib/validations/inbox";

describe("eventInputSchema", () => {
  it("accepts a valid minimal event", () => {
    const r = eventInputSchema.safeParse({
      title: "Tech Talk",
      startAt: "2026-06-21T10:00",
    });
    expect(r.success).toBe(true);
  });
  it("rejects a missing title", () => {
    const r = eventInputSchema.safeParse({ startAt: "2026-06-21T10:00" });
    expect(r.success).toBe(false);
  });
  it("normalizes empty optional URL/text to null", () => {
    const r = eventInputSchema.parse({
      title: "x",
      startAt: "2026-06-21T10:00",
      imageUrl: "",
      venue: "",
    });
    expect(r.imageUrl).toBeNull();
    expect(r.venue).toBeNull();
  });
  it("coerces an empty societyId to null", () => {
    const r = eventInputSchema.parse({
      title: "x",
      startAt: "2026-06-21T10:00",
      societyId: "",
    });
    expect(r.societyId).toBeNull();
  });
});

describe("articleInputSchema", () => {
  it("normalizes empty publicationDate to null", () => {
    const r = articleInputSchema.parse({ title: "A", publicationDate: "" });
    expect(r.publicationDate).toBeNull();
  });
});

describe("listQuerySchema", () => {
  it("applies defaults", () => {
    const q = listQuerySchema.parse({});
    expect(q.page).toBe(1);
    expect(q.pageSize).toBe(12);
  });
  it("coerces numeric strings", () => {
    expect(listQuerySchema.parse({ page: "3" }).page).toBe(3);
  });
});

describe("eventsQuerySchema", () => {
  it("defaults scope to all", () => {
    expect(eventsQuerySchema.parse({}).scope).toBe("all");
  });
  it("falls back to all for an invalid scope", () => {
    expect(eventsQuerySchema.parse({ scope: "bogus" }).scope).toBe("all");
  });
});

describe("flattenSearchParams", () => {
  it("drops empties/undefined and takes the first array value", () => {
    expect(
      flattenSearchParams({ a: "1", b: "", c: ["x", "y"], d: undefined }),
    ).toEqual({ a: "1", c: "x" });
  });
});

describe("contactMessageInputSchema", () => {
  it("requires a valid email", () => {
    expect(
      contactMessageInputSchema.safeParse({
        name: "A",
        email: "not-an-email",
        message: "hi",
      }).success,
    ).toBe(false);
    expect(
      contactMessageInputSchema.safeParse({
        name: "A",
        email: "a@b.com",
        message: "hi",
      }).success,
    ).toBe(true);
  });
});
