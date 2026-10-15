import type { PriceOffer } from "@/types";

export interface AnomalyResult {
  offerId: string;
  reason: string;
  severity: "low" | "high";
  deviation: number;
}

export function detectAnomalies(offers: PriceOffer[]): AnomalyResult[] {
  const byService = new Map<string, PriceOffer[]>();
  for (const o of offers) {
    const list = byService.get(o.serviceId) ?? [];
    list.push(o);
    byService.set(o.serviceId, list);
  }

  const anomalies: AnomalyResult[] = [];

  for (const [serviceId, serviceOffers] of byService) {
    if (serviceOffers.length < 3) continue;

    const prices = serviceOffers.map((o) => o.priceMin).sort((a, b) => a - b);
    const q1 = percentile(prices, 25);
    const q3 = percentile(prices, 75);
    const iqr = q3 - q1;

    if (iqr === 0) continue;

    const lowerFence = q1 - 1.5 * iqr;
    const upperFence = q3 + 1.5 * iqr;

    for (const offer of serviceOffers) {
      if (offer.priceMin > upperFence) {
        anomalies.push({
          offerId: offer.id,
          reason: `${formatPrice(offer.priceMin)} تومان — بالاتر از محدوده عادی (${formatPrice(upperFence)} تومان)`,
          severity: "high",
          deviation: (offer.priceMin - q3) / iqr,
        });
      } else if (offer.priceMin < lowerFence) {
        anomalies.push({
          offerId: offer.id,
          reason: `${formatPrice(offer.priceMin)} تومان — پایین‌تر از محدوده عادی (${formatPrice(lowerFence)} تومان)`,
          severity: "low",
          deviation: (q1 - offer.priceMin) / iqr,
        });
      }
    }
  }

  return anomalies;
}

export function getMarketStats(offers: PriceOffer[], serviceId: string) {
  const serviceOffers = offers.filter((o) => o.serviceId === serviceId);
  if (serviceOffers.length === 0) return null;

  const prices = serviceOffers.map((o) => o.priceMin).sort((a, b) => a - b);
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const median = prices[Math.floor(prices.length / 2)];

  return {
    count: serviceOffers.length,
    mean: Math.round(mean),
    median,
    min: prices[0],
    max: prices[prices.length - 1],
  };
}

function percentile(sorted: number[], p: number): number {
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

function formatPrice(price: number): string {
  if (price >= 1_000_000) {
    return `${(price / 1_000_000).toFixed(1)} میلیون`;
  }
  return `${(price / 1_000).toFixed(0)} هزار`;
}
