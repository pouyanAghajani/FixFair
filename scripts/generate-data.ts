import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "data");
mkdirSync(dataDir, { recursive: true });

const services = [
  { id: "srv-fender", name: "گلگیر", category: "bodywork", description: "تعمیر و صافکاری گلگیر" },
  { id: "srv-door", name: "درب", category: "bodywork", description: "تعمیر و تعویض درب" },
  { id: "srv-bumper", name: "سپر", category: "bodywork", description: "تعمیر و تعویض سپر" },
  { id: "srv-hood", name: "کاپوت", category: "bodywork", description: "تعمیر و صافکاری کاپوت" },
  { id: "srv-trunk", name: "درب صندوق", category: "bodywork", description: "تعمیر درب صندوق" },
  { id: "srv-paint-full", name: "رنگ کامل", category: "paint", description: "رنگ کامل ماشین" },
  { id: "srv-paint-partial", name: "رنگ جزئی", category: "paint", description: "رنگ جزئی و تاپینگ" },
  { id: "srv-glass-front", name: "شیشه جلو", category: "glass", description: "تعویض شیشه جلو" },
  { id: "srv-glass-side", name: "شیشه جانبی", category: "glass", description: "تعویض شیشه جانبی" },
  { id: "srv-glass-rear", name: "شیشه عقب", category: "glass", description: "تعویض شیشه عقب" },
  { id: "srv-ac", name: "کولر", category: "ac", description: "تعمیر و شارژ کولر" },
  { id: "srv-tires", name: "لاستیک", category: "tires", description: "تعویض و نصب لاستیک" },
  { id: "srv-brakes", name: "ترمز", category: "brakes", description: "تعمیر سیستم ترمز" },
  { id: "srv-suspension", name: "تعلیق", category: "suspension", description: "تعمیر سیستم تعلیق" },
  { id: "srv-transmission", name: "گیربکس", category: "transmission", description: "تعمیر گیربکس" },
  { id: "srv-engine", name: "موتور", category: "mechanical", description: "تعمیر موتور" },
  { id: "srv-electrical", name: "برق", category: "electrical", description: "تعمیر سیستم برق" },
  { id: "srv-battery", name: "باتری", category: "electrical", description: "تعویض باتری" },
  { id: "srv-alternator", name: "دینام", category: "electrical", description: "تعمیر و تعویض دینام" },
  { id: "srv-radiator", name: "رادیاتور", category: "mechanical", description: "تعمیر و تعویض رادیاتور" },
];

const districts = [
  { name: "تهرانپارس", lat: 35.732, lng: 51.531 },
  { name: "سعادت‌آباد", lat: 35.787, lng: 51.375 },
  { name: "نارمک", lat: 35.75, lng: 51.505 },
  { name: "یوسف‌آباد", lat: 35.74, lng: 51.41 },
  { name: "شهرک غرب", lat: 35.758, lng: 51.36 },
  { name: "پونک", lat: 35.761, lng: 51.32 },
  { name: "آزادی", lat: 35.72, lng: 51.33 },
  { name: "ولیعصر", lat: 35.72, lng: 51.41 },
  { name: "تجریش", lat: 35.805, lng: 51.43 },
  { name: "نیاوران", lat: 35.815, lng: 51.46 },
  { name: "دروس", lat: 35.77, lng: 51.45 },
  { name: "پاسداران", lat: 35.77, lng: 51.43 },
  { name: "ملت", lat: 35.71, lng: 51.38 },
  { name: "امیرآباد", lat: 35.73, lng: 51.39 },
  { name: "کارون", lat: 35.70, lng: 51.37 },
  { name: "گیشا", lat: 35.70, lng: 51.36 },
  { name: "جنت‌آباد", lat: 35.75, lng: 51.48 },
  { name: "مرکزی", lat: 35.69, lng: 51.42 },
  { name: "جنوب", lat: 35.66, lng: 51.40 },
  { name: "شرق", lat: 35.70, lng: 51.44 },
];

const carBrands = [
  { brand: "ایران‌خودرو", models: ["پراید", "سمند", "تیبا", "آریسان", "کوییک"] },
  { brand: "سایپا", models: ["پراید سایپا", "ساینا", "کوییک سایپا", "شاهین"] },
  { brand: "چانگان", models: ["چانگان CS35", "چانگان CS55", "چانگان EADO"] },
  { brand: "کیا", models: ["کیا سراتو", "کیا اپتیما", "کیا اسپورتیج"] },
  { brand: "هیوندای", models: ["هیوندای آوانته", "هیوندای سانتافه", "هیوندای توسان"] },
  { brand: "تویوتا", models: ["تویوتا کرولا", "تویوتا کمری", "تویوتا لندکروزر"] },
  { brand: "میتسوبیشی", models: ["میتسوبیشی لنسر", "میتسوبیشی پاجرو", "میتسوبیشی اوتلندر"] },
  { brand: "رنو", models: ["رنو سیمبل", "رنو کپچر", "رنو مگان"] },
  { brand: "پژو", models: ["پژو ۲۰۶", "پژو ۲۰۷", "پژو پارس", "پژو ۳۰۱"] },
  { brand: "مزدا", models: ["مزدا ۳", "مزدا ۲", "مزدا CX-5"] },
  { brand: "نیسان", models: ["نیسان آریا", "نیسان ایکس‌تریل"] },
  { brand: "ب‌ام‌و", models: ["ب‌ام‌و سری ۳", "ب‌ام‌و سری ۵"] },
];

const shopNames = [
  "تعمیرگاه پارسه",
  "گالری خودرو آریا",
  "تعمیرگاه مدرن تهران",
  "صنایع بدنه کوروش",
  "تعمیرگاه البرز",
  "گالری رنگ پارس",
  "تعمیرگاه مکانیک سپاهان",
  "تعمیرگاه برق خودرو شرق",
  "صنایع صافکاری کیان",
  "تعمیرگاه تخصصی گلگیر",
  "گالری آرین خودرو",
  "تعمیرگاه دیزل تهران",
  "تعمیرگاه تعلیق و ترمز پارس",
  "صنایع بدنه و رنگ مهر",
  "تعمیرگاه سرویس سریع خودرو",
  "گالری صادقی",
  "تعمیرگاه برق و الکترونیک خودرو",
  "تعمیرگاه تخصصی پژو",
  "صنایع بدنه رضا",
  "تعمیرگاه نیسان و میتسوبیشی",
  "گالری رنگ و صافکاری پاسداران",
  "تعمیرگاه مکانیک پیشرو",
  "تعمیرگاه کولر و برودت خودرو",
  "صنایع بدنه و سپر آریا",
  "تعمیرگاه گیربکس تهران",
  "گالری خودرو سعادت",
  "تعمیرگاه تخصصی شیشه خودرو",
  "تعمیرگاه لاستیک و زنجیر",
  "صنایع بدنه و رنگ نیاوران",
  "تعمیرگاه برق خودرو نارمک",
  "تعمیرگاه مکانیک و دیزل پونک",
  "گالری رنگ آزادی",
  "تعمیرگاه تخصصی ایران‌خودرو",
  "صنایع بدنه و گلگیر ملت",
  "تعمیرگاه سرویس کامل خودرو",
  "تعمیرگاه تعلیک و دیفرانسیل",
  "گالری خودرو تجریش",
  "تعمیرگاه برق و باتری تهران",
  "صنایع بدنه و رنگ گیشا",
  "تعمیرگاه مکانیک جنت‌آباد",
  "تعمیرگاه تخصصی هیوندای",
  "گالری رنگ و صافکاری سپر",
  "تعمیرگاه گیربکس و دیفرانسیل",
  "صنایع بدنه کارون",
  "تعمیرگاه برق خودرو امیرآباد",
  "تعمیرگاه تخصصی تویوتا",
  "گالری خودرو پاستاران",
  "تعمیرگاه مکانیک و برق دروس",
  "صنایع بدنه و رنگ نارمک",
  "تعمیرگاه کولر و رادیاتور",
  "تعمیرگاه تخصصی رنو",
  "گالری رنگ و صافکاری شرق",
  "تعمیرگاه تعلیق و ترمز پارس",
  "صنایع بدنه و سپر تهران",
  "تعمیرگاه برق و الکترونیک خودرو",
  "تعمیرگاه تخصصی مزدا",
  "گالری خودرو مرکزی",
  "تعمیرگاه مکانیک و دیزل جنوب",
  "صنایع بدنه و رنگ آزادی",
];

const priceRanges: Record<string, { min: number; max: number }> = {
  "srv-fender": { min: 800_000, max: 2_500_000 },
  "srv-door": { min: 1_000_000, max: 3_000_000 },
  "srv-bumper": { min: 600_000, max: 2_000_000 },
  "srv-hood": { min: 1_000_000, max: 3_500_000 },
  "srv-trunk": { min: 900_000, max: 2_800_000 },
  "srv-paint-full": { min: 8_000_000, max: 25_000_000 },
  "srv-paint-partial": { min: 1_500_000, max: 5_000_000 },
  "srv-glass-front": { min: 1_000_000, max: 3_500_000 },
  "srv-glass-side": { min: 500_000, max: 2_000_000 },
  "srv-glass-rear": { min: 800_000, max: 2_500_000 },
  "srv-ac": { min: 500_000, max: 2_500_000 },
  "srv-tires": { min: 400_000, max: 1_500_000 },
  "srv-brakes": { min: 600_000, max: 2_000_000 },
  "srv-suspension": { min: 800_000, max: 3_000_000 },
  "srv-transmission": { min: 2_000_000, max: 8_000_000 },
  "srv-engine": { min: 3_000_000, max: 15_000_000 },
  "srv-electrical": { min: 400_000, max: 2_000_000 },
  "srv-battery": { min: 500_000, max: 2_000_000 },
  "srv-alternator": { min: 700_000, max: 2_500_000 },
  "srv-radiator": { min: 600_000, max: 2_000_000 },
};

const notes = [
  "قیمت شامل مواد مصرفی نیست",
  "قیمت شامل رنگ و صافکاری",
  "فقط صافکاری",
  "قیمت نهایی پس از بررسی",
  "شامل تعویض قطعه",
  "قیمت برای خودروهای بنزینی",
  "قیمت برای خودروهای دیزلی",
  "شامل گارانتی ۶ ماهه",
  "قیمت متغیر بسته به میزان آسیب",
  "شامل استاکر و بسته",
];

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateShops() {
  return shopNames.map((name, i) => {
    const district = districts[i % districts.length];
    return {
      id: `shop-${String(i + 1).padStart(3, "0")}`,
      name,
      phone: `021-${rand(22000000, 22999999)}`,
      address: `تهران، ${district.name}، ${pick(["خیابان اصلی", "کوچه", "بن‌بست", "بلوار"])} ${rand(1, 50)}`,
      district: district.name,
      lat: randFloat(district.lat - 0.02, district.lat + 0.02),
      lng: randFloat(district.lng - 0.02, district.lng + 0.02),
      rating: randFloat(3.5, 5.0),
      reviewCount: rand(5, 150),
      isVerified: Math.random() > 0.3,
    };
  });
}

function generateOffers(shops: ReturnType<typeof generateShops>) {
  const offers = [];
  let id = 1;
  for (const shop of shops) {
    const numOffers = rand(3, 6);
    const shuffled = [...services].sort(() => Math.random() - 0.5);
    for (let i = 0; i < numOffers; i++) {
      const service = shuffled[i];
      const car = pick(carBrands);
      const model = pick(car.models);
      const range = priceRanges[service.id];
      const priceMin = range.min + rand(0, range.min * 0.5);
      const priceMax = priceMin + rand(range.min * 0.3, range.max - range.min);
      offers.push({
        id: `offer-${String(id++).padStart(4, "0")}`,
        shopId: shop.id,
        serviceId: service.id,
        carBrand: car.brand,
        carModel: model,
        priceMin: Math.round(priceMin / 10000) * 10000,
        priceMax: Math.round(priceMax / 10000) * 10000,
        currency: "IRR",
        source: pick(["مجموعه تهران خودرو", "نمایشگاه خودرو", "تعمیرگاه مستقل", "گالری آنلاین"]),
        isReal: false,
        notes: pick(notes),
        createdAt: new Date(rand(2024, 2026), rand(0, 11), rand(1, 28)).toISOString(),
      });
    }
  }
  return offers;
}

function generateReviews(shops: ReturnType<typeof generateShops>) {
  const reviewTexts = [
    "کیفیت کار خوب بود، قیمت هم منطقی",
    "صافکاری عولی، رنگ هم کاملاً مطابق بود",
    "قیمت بالا ولی کیفیت تضمین شده",
    "سرعت کار خوب بود",
    "قیمت پایین‌تر از بقیه تعمیرگاه‌ها",
    "کار حرفه‌ای ولی زمان زیاد طول کشید",
    "رنگ کامل شد، کاملاً راضی هستم",
    "تعمیر گلگیر خوب انجام شد",
    "قیمت مناسب و کیفیت قابل قبول",
    "به شدت توصیه می‌کنم",
    "کار بدی نبود ولی بهترش می‌شد",
    "قیمت بالا ولی تضمین کار می‌دن",
    "سریع و دقیق کار کردند",
    "رنگ مطابق کد ماشین شد",
    "تعمیر کامل و خوب",
  ];
  const authors = ["علی", "رضا", "محمد", "حسین", "امیر", "سجاد", "کیان", "پارسا", "آرش", "میلاد"];
  const reviews = [];
  let id = 1;
  for (const shop of shops) {
    const numReviews = rand(1, 4);
    for (let i = 0; i < numReviews; i++) {
      reviews.push({
        id: `rev-${String(id++).padStart(4, "0")}`,
        shopId: shop.id,
        author: pick(authors),
        rating: rand(3, 5),
        text: pick(reviewTexts),
        createdAt: new Date(rand(2024, 2026), rand(0, 11), rand(1, 28)).toISOString(),
      });
    }
  }
  return reviews;
}

const shops = generateShops();
const offers = generateOffers(shops);
const reviews = generateReviews(shops);

writeFileSync(join(dataDir, "services.json"), JSON.stringify(services, null, 2));
writeFileSync(join(dataDir, "shops.json"), JSON.stringify(shops, null, 2));
writeFileSync(join(dataDir, "price_offers.json"), JSON.stringify(offers, null, 2));
writeFileSync(join(dataDir, "reviews.json"), JSON.stringify(reviews, null, 2));

console.log(`Generated: ${services.length} services, ${shops.length} shops, ${offers.length} offers, ${reviews.length} reviews`);
