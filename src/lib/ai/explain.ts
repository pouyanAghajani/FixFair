import type { PriceOffer, Shop } from "@/types";
import type { ExplainResult } from "./schemas";
import { getMarketStats } from "@/lib/ranking/anomaly";
import { haversineDistance, TEHRAN_CENTER, type LatLng } from "@/lib/geo/distance";

export function explainResult(
  shop: Shop,
  offer: PriceOffer,
  allOffers: PriceOffer[],
  referencePoint: LatLng = TEHRAN_CENTER
): ExplainResult {
  const stats = getMarketStats(allOffers, offer.serviceId);
  const distanceKm = haversineDistance(referencePoint, { lat: shop.lat, lng: shop.lng });

  const reasons: string[] = [];
  const warnings: string[] = [];

  if (stats) {
    const avgPrice = stats.mean;
    const diff = offer.priceMin - avgPrice;
    const pct = Math.round((diff / avgPrice) * 100);

    if (pct < -5) {
      reasons.push(`${Math.abs(pct)}٪ کمتر از میانگین بازار (${formatPrice(avgPrice)} تومان)`);
    } else if (pct > 10) {
      warnings.push(`${pct}٪ بیشتر از میانگین بازار`);
    }
  }

  if (shop.rating >= 4.5) {
    reasons.push(`امتیاز عالی ${shop.rating} از ۵`);
  } else if (shop.rating >= 4) {
    reasons.push(`امتیاز خوب ${shop.rating} از ۵`);
  }

  if (distanceKm < 3) {
    reasons.push(`فقط ${distanceKm.toFixed(1)} کیلومتر فاصله`);
  } else {
    reasons.push(`${distanceKm.toFixed(1)} کیلومتر فاصله از مرکز تهران`);
  }

  if (shop.isVerified) {
    reasons.push("تعمیرگاه تأیید شده");
  }

  const priceRange = `${formatPrice(offer.priceMin)} تا ${formatPrice(offer.priceMax)} تومان`;
  const summary = `${shop.name} — ${priceRange}`;

  if (offer.priceMin > stats!.mean * 1.5) {
    warnings.push("قیمت به طور مشکوکی بالاتر از میانگین بازار است");
  }

  return { shopId: shop.id, summary, reasons, warnings };
}

function formatPrice(price: number): string {
  if (price >= 1_000_000) {
    return `${(price / 1_000_000).toFixed(1)} میلیون`;
  }
  return `${(price / 1_000).toFixed(0)} هزار`;
}
