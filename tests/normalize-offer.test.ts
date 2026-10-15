import { describe, expect, it } from "vitest";
import { normalizeOfferDeterministic } from "@/lib/ai/normalize-offer";

describe("normalizeOfferDeterministic", () => {
  it("parses simple price with paint", () => {
    const result = normalizeOfferDeterministic("گلگیر ۲ میلیون با رنگ");
    expect(result.service).toBe("گلگیر");
    expect(result.priceMin).toBe(2000000);
    expect(result.priceMax).toBe(2000000);
    expect(result.includesPaint).toBe(true);
  });

  it("parses short form price", () => {
    const result = normalizeOfferDeterministic("صافکاری+رنگ گلگیر: ۲.۵ت");
    expect(result.service).toBe("گلگیر");
    expect(result.priceMin).toBe(2500000);
    expect(result.includesPaint).toBe(true);
  });

  it("parses price range", () => {
    const result = normalizeOfferDeterministic("گلگیر پراید ۱.۵ تا ۲ میلیون");
    expect(result.service).toBe("گلگیر");
    expect(result.carModel).toBe("پراید");
    expect(result.priceMin).toBe(1500000);
    expect(result.priceMax).toBe(2000000);
  });

  it("parses mixed unit range", () => {
    const result = normalizeOfferDeterministic("کولر گازی ۵۰۰ هزار تا ۱ میلیون");
    expect(result.priceMin).toBe(500000);
    expect(result.priceMax).toBe(1000000);
  });

  it("parses toman suffix without multiplication", () => {
    const result = normalizeOfferDeterministic("ترمز پژو ۲۰۶ ۸۰۰۰۰۰ تومان");
    expect(result.service).toBe("ترمز");
    expect(result.priceMin).toBe(800000);
  });

  it("detects car model", () => {
    const result = normalizeOfferDeterministic("شیشه جلو تویوتا کرولا ۱.۲ میلیون تا ۱.۸ میلیون");
    expect(result.service).toBe("شیشه جلو");
    expect(result.carModel).toBe("کرولا");
    expect(result.priceMin).toBe(1200000);
    expect(result.priceMax).toBe(1800000);
  });

  it("handles empty text", () => {
    const result = normalizeOfferDeterministic("");
    expect(result.service).toBeNull();
    expect(result.priceMin).toBeNull();
  });
});
