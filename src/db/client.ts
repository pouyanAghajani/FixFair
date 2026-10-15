import { readFileSync } from "fs";
import { join } from "path";
import type { Database } from "@/types";

const dataDir = join(process.cwd(), "data");

let cache: Database | null = null;

export function getDatabase(): Database {
  if (cache) return cache;

  cache = {
    shops: JSON.parse(readFileSync(join(dataDir, "shops.json"), "utf-8")),
    services: JSON.parse(readFileSync(join(dataDir, "services.json"), "utf-8")),
    priceOffers: JSON.parse(readFileSync(join(dataDir, "price_offers.json"), "utf-8")),
    reviews: JSON.parse(readFileSync(join(dataDir, "reviews.json"), "utf-8")),
  };

  return cache;
}
