import { describe, expect, it } from "vitest";
import { filterOffers, rankOffers, type Intent } from "@/lib/ranking/rank";
import { detectAnomalies, getMarketStats } from "@/lib/ranking/anomaly";
import { explainResult } from "@/lib/ai/explain";
import type { PriceOffer, Shop } from "@/types";

const shops: Shop[] = [
  { id: "s1", name: "Shop A", phone: "021", address: " Tehran", district: "تهرانپارس", lat: 35.7, lng: 51.5, rating: 4.8, reviewCount: 50, isVerified: true },
  { id: "s2", name: "Shop B", phone: "021", address: "Tehran", district: "سعادت‌آباد", lat: 35.78, lng: 51.37, rating: 4.2, reviewCount: 30, isVerified: false },
  { id: "s3", name: "Shop C", phone: "021", address: "Tehran", district: "مرکزی", lat: 35.69, lng: 51.39, rating: 3.9, reviewCount: 20, isVerified: true },
];

const offers: PriceOffer[] = [
  { id: "o1", shopId: "s1", serviceId: "srv-fender", carBrand: "ایران‌خودرو", carModel: "پراید", priceMin: 1_000_000, priceMax: 1_500_000, currency: "IRR", source: "test", isReal: false, notes: "", createdAt: "2025-01-01" },
  { id: "o2", shopId: "s2", serviceId: "srv-fender", carBrand: "ایران‌خودرو", carModel: "پراید", priceMin: 800_000, priceMax: 1_200_000, currency: "IRR", source: "test", isReal: false, notes: "", createdAt: "2025-01-01" },
  { id: "o3", shopId: "s3", serviceId: "srv-fender", carBrand: "ایران‌خودرو", carModel: "پراید", priceMin: 1_200_000, priceMax: 1_800_000, currency: "IRR", source: "test", isReal: false, notes: "", createdAt: "2025-01-01" },
  { id: "o4", shopId: "s1", serviceId: "srv-fender", carBrand: "ایران‌خودرو", carModel: "پراید", priceMin: 50_000_000, priceMax: 60_000_000, currency: "IRR", source: "test", isReal: false, notes: "", createdAt: "2025-01-01" },
  { id: "o5", shopId: "s2", serviceId: "srv-door", carBrand: "ایران‌خودرو", carModel: "پراید", priceMin: 900_000, priceMax: 1_300_000, currency: "IRR", source: "test", isReal: false, notes: "", createdAt: "2025-01-01" },
];

describe("filterOffers", () => {
  it("filters by service", () => {
    const filtered = filterOffers(offers, { service: "srv-fender" });
    expect(filtered.length).toBe(4);
  });

  it("filters by car model", () => {
    const filtered = filterOffers(offers, { carModel: "پراید" });
    expect(filtered.length).toBe(5);
  });

  it("returns all when no filter", () => {
    const filtered = filterOffers(offers, {});
    expect(filtered.length).toBe(5);
  });
});

describe("rankOffers", () => {
  it("ranks by cheapest", () => {
    const ranked = rankOffers(offers, shops, "cheapest");
    expect(ranked[0].offer.priceMin).toBe(800_000);
  });

  it("ranks by nearest", () => {
    const ranked = rankOffers(offers, shops, "nearest", { lat: 35.69, lng: 51.39 });
    expect(ranked[0].shop.district).toBe("مرکزی");
  });

  it("ranks by best rated", () => {
    const ranked = rankOffers(offers, shops, "best_rated");
    expect(ranked[0].shop.rating).toBe(4.8);
  });

  it("ranks by best value", () => {
    const ranked = rankOffers(offers, shops, "best_value");
    expect(ranked[0].score).toBeGreaterThan(0);
  });
});

describe("detectAnomalies", () => {
  it("detects suspiciously high prices", () => {
    const anomalies = detectAnomalies(offers);
    const high = anomalies.filter((a) => a.severity === "high");
    expect(high.length).toBeGreaterThan(0);
    expect(high[0].offerId).toBe("o4");
  });

  it("returns empty for small datasets", () => {
    const small = offers.slice(0, 2);
    expect(detectAnomalies(small).length).toBe(0);
  });
});

describe("getMarketStats", () => {
  it("computes stats for a service", () => {
    const stats = getMarketStats(offers, "srv-fender");
    expect(stats).not.toBeNull();
    expect(stats!.count).toBe(4);
    expect(stats!.min).toBe(800_000);
  });
});

describe("explainResult", () => {
  it("generates explanation with real numbers", () => {
    const shop = shops[0];
    const offer = offers[0];
    const result = explainResult(shop, offer, offers);
    expect(result.shopId).toBe("s1");
    expect(result.summary).toContain("Shop A");
    expect(result.reasons.length).toBeGreaterThan(0);
  });
});
