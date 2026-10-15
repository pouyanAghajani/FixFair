import { getDatabase } from "./client";

const db = getDatabase();

const serviceIds = new Set(db.services.map((s) => s.id));
const shopIds = new Set(db.shops.map((s) => s.id));

let valid = true;

for (const offer of db.priceOffers) {
  if (!shopIds.has(offer.shopId)) {
    console.error(`Invalid shopId in offer ${offer.id}: ${offer.shopId}`);
    valid = false;
  }
  if (!serviceIds.has(offer.serviceId)) {
    console.error(`Invalid serviceId in offer ${offer.id}: ${offer.serviceId}`);
    valid = false;
  }
  if (offer.priceMin >= offer.priceMax) {
    console.error(`Invalid price range in offer ${offer.id}: ${offer.priceMin} >= ${offer.priceMax}`);
    valid = false;
  }
}

for (const review of db.reviews) {
  if (!shopIds.has(review.shopId)) {
    console.error(`Invalid shopId in review ${review.id}: ${review.shopId}`);
    valid = false;
  }
}

if (!valid) {
  process.exit(1);
}

console.log(`Data valid: ${db.shops.length} shops, ${db.services.length} services, ${db.priceOffers.length} offers, ${db.reviews.length} reviews`);
