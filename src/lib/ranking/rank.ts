import type { PriceOffer, Shop } from "@/types";
import { haversineDistance, TEHRAN_CENTER, type LatLng } from "@/lib/geo/distance";

export type Intent = "cheapest" | "nearest" | "best_rated" | "best_value";

export interface RankedOffer {
  offer: PriceOffer;
  shop: Shop;
  distanceKm: number;
  score: number;
}

export function filterOffers(
  offers: PriceOffer[],
  query: { service?: string | null; carModel?: string | null }
): PriceOffer[] {
  return offers.filter((o) => {
    if (query.service && o.serviceId !== query.service) return false;
    if (query.carModel && !o.carModel.includes(query.carModel)) return false;
    return true;
  });
}

export function rankOffers(
  offers: PriceOffer[],
  shops: Shop[],
  intent: Intent,
  referencePoint: LatLng = TEHRAN_CENTER
): RankedOffer[] {
  const shopMap = new Map(shops.map((s) => [s.id, s]));

  const ranked: RankedOffer[] = offers
    .map((offer) => {
      const shop = shopMap.get(offer.shopId);
      if (!shop) return null;
      const distanceKm = haversineDistance(referencePoint, { lat: shop.lat, lng: shop.lng });
      return { offer, shop, distanceKm, score: 0 };
    })
    .filter((r): r is RankedOffer => r !== null);

  switch (intent) {
    case "cheapest":
      ranked.sort((a, b) => a.offer.priceMin - b.offer.priceMin);
      break;
    case "nearest":
      ranked.sort((a, b) => a.distanceKm - b.distanceKm);
      break;
    case "best_rated":
      ranked.sort((a, b) => b.shop.rating - a.shop.rating);
      break;
    case "best_value": {
      const maxPrice = Math.max(...ranked.map((r) => r.offer.priceMin), 1);
      const maxDist = Math.max(...ranked.map((r) => r.distanceKm), 1);
      for (const r of ranked) {
        const priceScore = 1 - r.offer.priceMin / maxPrice;
        const ratingScore = r.shop.rating / 5;
        const distScore = 1 - r.distanceKm / maxDist;
        r.score = priceScore * 0.4 + ratingScore * 0.4 + distScore * 0.2;
      }
      ranked.sort((a, b) => b.score - a.score);
      break;
    }
  }

  return ranked;
}
