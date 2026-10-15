import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseQuery } from "@/lib/ai/parse-query";
import { getAllOffers, getAllShops, getShopById, getServiceById } from "@/db/repositories";
import { rankOffers } from "@/lib/ranking/rank";
import { detectAnomalies } from "@/lib/ranking/anomaly";
import { explainResult } from "@/lib/ai/explain";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.query !== "string") {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const parsed = await parseQuery(body.query);

  const allOffers = getAllOffers();
  const allShops = getAllShops();

  const filtered = allOffers.filter((o) => {
    if (parsed.service) {
      const svc = getServiceById(o.serviceId);
      if (svc && svc.name !== parsed.service) return false;
    }
    if (parsed.carModel && !o.carModel.includes(parsed.carModel)) return false;
    return true;
  });

  const ranked = rankOffers(filtered, allShops, parsed.intent);
  const anomalies = detectAnomalies(filtered);

  const results = ranked.slice(0, 10).map((r) => {
    const explanation = explainResult(r.shop, r.offer, filtered);
    const isAnomalous = anomalies.some((a) => a.offerId === r.offer.id);
    return {
      offer: r.offer,
      shop: r.shop,
      distanceKm: Math.round(r.distanceKm * 10) / 10,
      explanation,
      isAnomalous,
    };
  });

  return NextResponse.json({
    parsed,
    results,
    total: filtered.length,
  });
}
