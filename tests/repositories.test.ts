import { describe, expect, it } from "vitest";
import {
  getAllShops,
  getShopById,
  getShopsByDistrict,
  getAllServices,
  getServiceById,
  searchServices,
  getAllOffers,
  getOffersByShop,
  getOffersByService,
  getOffersByCarModel,
  getAllReviews,
  getReviewsByShop,
} from "@/db/repositories";

describe("data integrity", () => {
  it("loads all data", () => {
    expect(getAllShops().length).toBeGreaterThan(0);
    expect(getAllServices().length).toBeGreaterThan(0);
    expect(getAllOffers().length).toBeGreaterThan(0);
    expect(getAllReviews().length).toBeGreaterThan(0);
  });

  it("all offers reference valid shops and services", () => {
    const shopIds = new Set(getAllShops().map((s) => s.id));
    const serviceIds = new Set(getAllServices().map((s) => s.id));
    for (const offer of getAllOffers()) {
      expect(shopIds.has(offer.shopId)).toBe(true);
      expect(serviceIds.has(offer.serviceId)).toBe(true);
      expect(offer.priceMin).toBeLessThan(offer.priceMax);
    }
  });

  it("all reviews reference valid shops", () => {
    const shopIds = new Set(getAllShops().map((s) => s.id));
    for (const review of getAllReviews()) {
      expect(shopIds.has(review.shopId)).toBe(true);
    }
  });

  it("all offers are marked synthetic", () => {
    for (const offer of getAllOffers()) {
      expect(offer.isReal).toBe(false);
    }
  });
});

describe("repositories", () => {
  it("finds shop by id", () => {
    const shop = getShopById("shop-001");
    expect(shop).toBeDefined();
    expect(shop?.name).toBe("تعمیرگاه پارسه");
  });

  it("filters shops by district", () => {
    const shops = getShopsByDistrict("تهرانپارس");
    expect(shops.length).toBeGreaterThan(0);
    for (const s of shops) {
      expect(s.district).toBe("تهرانپارس");
    }
  });

  it("finds service by id", () => {
    const service = getServiceById("srv-fender");
    expect(service).toBeDefined();
    expect(service?.name).toBe("گلگیر");
  });

  it("searches services by name", () => {
    const results = searchServices("گلگیر");
    expect(results.length).toBeGreaterThan(0);
  });

  it("gets offers by shop", () => {
    const offers = getOffersByShop("shop-001");
    expect(offers.length).toBeGreaterThan(0);
  });

  it("gets offers by service", () => {
    const offers = getOffersByService("srv-fender");
    expect(offers.length).toBeGreaterThan(0);
  });

  it("gets offers by car model", () => {
    const offers = getOffersByCarModel("پراید");
    expect(offers.length).toBeGreaterThan(0);
  });

  it("gets reviews by shop", () => {
    const reviews = getReviewsByShop("shop-001");
    expect(Array.isArray(reviews)).toBe(true);
  });
});
