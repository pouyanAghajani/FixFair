import { describe, expect, it } from "vitest";
import { parseQueryDeterministic } from "@/lib/ai/parse-query";

describe("parseQueryDeterministic", () => {
  it("parses service, car, and city", () => {
    const result = parseQueryDeterministic("گلگیر جلوی پراید خورده، تهران");
    expect(result.service).toBe("گلگیر");
    expect(result.carModel).toBe("پراید");
    expect(result.city).toBe("تهران");
  });

  it("detects cheapest intent", () => {
    const result = parseQueryDeterministic("ارزان‌ترین تعمیر گلگیر پراید");
    expect(result.intent).toBe("cheapest");
    expect(result.service).toBe("گلگیر");
  });

  it("detects nearest intent", () => {
    const result = parseQueryDeterministic("نزدیک‌ترین تعمیرگاه برق تهران");
    expect(result.intent).toBe("nearest");
  });

  it("detects best rated intent", () => {
    const result = parseQueryDeterministic("بهترین امتیاز تعمیر موتور پژو ۲۰۶");
    expect(result.intent).toBe("best_rated");
  });

  it("extracts car model without brand prefix", () => {
    const result = parseQueryDeterministic("رنگ کامل سمند در تهران");
    expect(result.carModel).toBe("سمند");
    expect(result.service).toBe("رنگ کامل");
  });

  it("normalizes Persian digits", () => {
    const result = parseQueryDeterministic("کولر گازی کیا سراتو تهران");
    expect(result.service).toBe("کولر");
    expect(result.carModel).toBe("سراتو");
  });

  it("prefers specific service over generic paint", () => {
    const result = parseQueryDeterministic("صافکاری و رنگ گلگیر پراید");
    expect(result.service).toBe("گلگیر");
  });

  it("defaults to best_value intent", () => {
    const result = parseQueryDeterministic("گلگیر پراید");
    expect(result.intent).toBe("best_value");
  });

  it("handles empty query", () => {
    const result = parseQueryDeterministic("");
    expect(result.service).toBeNull();
    result.carModel = null;
    expect(result.intent).toBe("best_value");
  });
});
