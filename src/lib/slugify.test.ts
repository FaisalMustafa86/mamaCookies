import { describe, it, expect } from "vitest";
import { slugify } from "./slugify";

describe("slugify", () => {
  it("lowercases and hyphenates a normal phrase", () => {
    expect(slugify("Chocolate Chip")).toBe("chocolate-chip");
  });

  it("strips apostrophes (straight and curly) without inserting a hyphen", () => {
    expect(slugify("Specially Eat'em")).toBe("specially-eatem");
    expect(slugify("Specially Eat’em")).toBe("specially-eatem");
  });

  it("collapses runs of non-alphanumeric characters into a single hyphen", () => {
    expect(slugify("Cookies & Cream!!!")).toBe("cookies-cream");
    expect(slugify("a   b___c")).toBe("a-b-c");
  });

  it("trims leading and trailing separators", () => {
    expect(slugify("  --Hello--  ")).toBe("hello");
    expect(slugify("!!!edge!!!")).toBe("edge");
  });

  it("keeps digits", () => {
    expect(slugify("Box of 12")).toBe("box-of-12");
  });

  it("returns an empty string when there are no alphanumerics", () => {
    expect(slugify("   ")).toBe("");
    expect(slugify("---")).toBe("");
    expect(slugify("'’")).toBe("");
  });

  it("drops non-ASCII letters (current ASCII-only behaviour)", () => {
    // Documents existing behaviour: accented/unicode letters are not transliterated.
    expect(slugify("Crème Brûlée")).toBe("cr-me-br-l-e");
  });

  it("is idempotent on an already-slugified value", () => {
    const once = slugify("Double Chocolate Deluxe");
    expect(slugify(once)).toBe(once);
  });
});
