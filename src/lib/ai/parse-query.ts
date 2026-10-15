import { getAllServices } from "@/db/repositories";
import type { ParseQueryResult } from "./schemas";

const SERVICE_SYNONYMS: Record<string, string[]> = {
  "srv-fender": ["گلگیر", "فندربند"],
  "srv-door": ["درب"],
  "srv-bumper": ["سپر", "کروزک"],
  "srv-hood": ["کاپوت", "هود", "درپوش موتور"],
  "srv-trunk": ["درب صندوق", "ترانک"],
  "srv-paint-full": ["رنگ کامل", "رنگ کل"],
  "srv-paint-partial": ["رنگ جزئی", "تاپینگ", "صافکاری و رنگ", "رنگ و صافکاری", "صافکاری"],
  "srv-glass-front": ["شیشه جلو", "گریل جلو", "وایپر جلو"],
  "srv-glass-side": ["شیشه جانبی", "شیشه کناری"],
  "srv-glass-rear": ["شیشه عقب", "گریل عقب"],
  "srv-ac": ["کولر", "برودت", "ای سی"],
  "srv-tires": ["لاستیک", "وایر", "چرخ"],
  "srv-brakes": ["ترمز", "لنت ترمز", "لنت"],
  "srv-suspension": ["تعلیق", "سواسپرینگ", "شوک", "سوسپانسیون"],
  "srv-transmission": ["گیربکس", "کلاچ"],
  "srv-engine": ["موتور", "سوپاپ"],
  "srv-electrical": ["برق", "الکترونیک", "فیوز"],
  "srv-battery": ["باتری"],
  "srv-alternator": ["دینام", "آلتیناتور"],
  "srv-radiator": ["رادیاتور", "رادیاتر", "ترموستات"],
};

const CAR_BRANDS: Record<string, string[]> = {
  "چانگان": ["CS35", "CS55", "EADO"],
  "کیا": ["سراتو", "اپتیما", "اسپورتیج"],
  "هیوندای": ["آوانته", "سانتافه", "توسان"],
  "تویوتا": ["کرولا", "کمری", "لندکروزر"],
  "میتسوبیشی": ["لنسر", "پاجرو", "اوتلندر"],
  "رنو": ["سیمبل", "کپچر", "مگان"],
  "پژو": ["۲۰۶", "۲۰۷", "پارس", "۳۰۱"],
  "مزدا": ["۳", "۲", "CX-5"],
  "نیسان": ["آریا", "ایکس‌تریل"],
  "ب‌ام‌و": ["سری ۳", "سری ۵"],
  "سایپا": ["ساینا", "شاهین"],
  "ایران‌خودرو": ["پراید", "سمند", "تیبا", "کوییک"],
};

const GENERIC_MODELS = [
  "پراید", "سمند", "تیبا", "کوییک", "ساینا", "شاهین",
  "سراتو", "کپچر", "مگان", "سیمبل", "پارس",
  "لنسر", "پاجرو", "آریا", "کرولا", "کمری",
  "آوانته", "سانتافه", "توسان", "ایکس‌تریل", "لندکروزر",
  "اوتلندر", "اپتیما", "اسپورتیج", "CX-5",
];

const INTENT_PATTERNS: Array<{ intent: ParseQueryResult["intent"]; patterns: string[] }> = [
  { intent: "cheapest", patterns: ["ارزان‌ترین", "ارزان", "کم‌هزینه", "اقتصادی"] },
  { intent: "nearest", patterns: ["نزدیک‌ترین", "نزدیک"] },
  { intent: "best_rated", patterns: ["بهترین امتیاز", "بالاترین امتیاز", "بهترین کیفیت", "باکیفیت"] },
  { intent: "best_value", patterns: ["بهترین", "پیشنهاد", "مناسب"] },
];

const CITIES = ["تهران", "کرج", "اصفهان", "شیراز", "مشهد", "تبریز", "اهواز", "قم"];

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

function normalizePersian(text: string): string {
  return text
    .replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d)))
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/ة/g, "ه")
    .replace(/‌/g, " ")
    .trim()
    .toLowerCase();
}

export function parseQueryDeterministic(query: string): ParseQueryResult {
  const normalized = normalizePersian(query);

  let service: string | null = null;
  let servicePos = Infinity;
  let serviceConfidence = 0;

  const allServices = getAllServices();
  for (const svc of allServices) {
    const pos = normalized.indexOf(normalizePersian(svc.name));
    if (pos !== -1 && pos < servicePos) {
      service = svc.name;
      servicePos = pos;
      serviceConfidence = 0.9;
    }
  }

  const GENERIC_SERVICE_TERMS = ["صافکاری", "رنگ"];

  for (const [serviceId, synonyms] of Object.entries(SERVICE_SYNONYMS)) {
    for (const syn of synonyms) {
      if (service && GENERIC_SERVICE_TERMS.some((g) => syn.includes(g))) continue;
      const pos = normalized.indexOf(normalizePersian(syn));
      if (pos !== -1 && pos < servicePos) {
        const found = allServices.find((s) => s.id === serviceId);
        if (found) {
          service = found.name;
          servicePos = pos;
          serviceConfidence = 0.85;
        }
      }
    }
  }

  let carModel: string | null = null;
  let carBrand: string | null = null;

  for (const [brand, models] of Object.entries(CAR_BRANDS)) {
    for (const model of models) {
      const isSafe = model.length > 2 || /[a-zA-Z]/.test(model);
      if (isSafe && normalized.includes(normalizePersian(model))) {
        carModel = model;
        carBrand = brand;
        break;
      }
      const compound = normalizePersian(`${brand} ${model}`);
      if (normalized.includes(compound)) {
        carModel = model;
        carBrand = brand;
        break;
      }
    }
    if (carModel) break;
  }

  if (!carModel) {
    for (const model of GENERIC_MODELS) {
      if (normalized.includes(normalizePersian(model))) {
        carModel = model;
        break;
      }
    }
  }

  let city: string | null = null;
  for (const c of CITIES) {
    if (normalized.includes(normalizePersian(c))) {
      city = c;
      break;
    }
  }

  let intent: ParseQueryResult["intent"] = "best_value";
  let intentConfidence = 0.6;

  for (const { intent: i, patterns } of INTENT_PATTERNS) {
    for (const p of patterns) {
      if (normalized.includes(normalizePersian(p))) {
        intent = i;
        intentConfidence = 0.9;
        break;
      }
    }
    if (intentConfidence > 0.6) break;
  }

  const fields = [service, carModel, city].filter(Boolean).length;
  const confidence = Math.min(0.95, 0.4 + fields * 0.15 + serviceConfidence * 0.1);

  return {
    service,
    carBrand,
    carModel,
    city,
    intent,
    confidence: Math.round(confidence * 100) / 100,
  };
}

export async function parseQuery(query: string): Promise<ParseQueryResult> {
  const { hasApiKey, parseQueryWithLLM } = await import("./client");
  if (hasApiKey()) {
    try {
      return await parseQueryWithLLM(query);
    } catch {
      return parseQueryDeterministic(query);
    }
  }
  return parseQueryDeterministic(query);
}
