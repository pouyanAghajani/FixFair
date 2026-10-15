import { getDatabase } from "./client";
import type { PriceOffer, Review, Service, Shop } from "@/types";

export function getAllShops(): Shop[] {
  return getDatabase().shops;
}

export function getShopById(id: string): Shop | undefined {
  return getDatabase().shops.find((s) => s.id === id);
}

export function getShopsByDistrict(district: string): Shop[] {
  return getDatabase().shops.filter((s) => s.district === district);
}

export function getAllServices(): Service[] {
  return getDatabase().services;
}

export function getServiceById(id: string): Service | undefined {
  return getDatabase().services.find((s) => s.id === id);
}

export function searchServices(query: string): Service[] {
  const q = query.trim();
  if (!q) return [];
  return getDatabase().services.filter(
    (s) => s.name.includes(q) || s.description.includes(q)
  );
}

export function getAllOffers(): PriceOffer[] {
  return getDatabase().priceOffers;
}

export function getOffersByShop(shopId: string): PriceOffer[] {
  return getDatabase().priceOffers.filter((o) => o.shopId === shopId);
}

export function getOffersByService(serviceId: string): PriceOffer[] {
  return getDatabase().priceOffers.filter((o) => o.serviceId === serviceId);
}

export function getOffersByCarModel(carModel: string): PriceOffer[] {
  const q = carModel.trim();
  if (!q) return [];
  return getDatabase().priceOffers.filter((o) => o.carModel.includes(q));
}

export function getAllReviews(): Review[] {
  return getDatabase().reviews;
}

export function getReviewsByShop(shopId: string): Review[] {
  return getDatabase().reviews.filter((r) => r.shopId === shopId);
}
