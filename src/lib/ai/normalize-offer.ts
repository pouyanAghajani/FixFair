import { getAllServices } from "@/db/repositories";
import type { NormalizeOfferResult } from "./schemas";

const SERVICE_KEYWORDS: Record<string, string[]> = {
  "گلگیر": ["گلگیر", "فندربند"],
  "درب": ["درب"],
  "سپر": ["سپر", "کروزک"],
  "کاپوت": ["کاپوت", "هود", "درپوش"],
  "شیشه": ["شیشه", "گریل", "وایپر"],
  "کولر": ["کولر", "برودت", "ای سی"],
  "لاستیک": ["لاستیک", "وایر", "چرخ"],
  "ترمز": ["ترمز", "لنت"],
  "تعلیق": ["تعلیق", "سواسپرینگ", "شوک", "گاز"],
  "گیربکس": ["گیربکس", "کلاچ"],
  "موتور": ["موتور", "سوپاپ"],
  "برق": ["برق", "الکترونیک", "فیوز"],
  "باتری": ["باتری"],
  "دینام": ["دینام", "آلتیناتور"],
  "رادیاتور": ["رادیاتور", "رادیاتر", "ترموستات"],
  "رنگ کامل": ["رنگ کامل", "رنگ کل"],
  "رنگ جزئی": ["رنگ جزئی", "تاپینگ", "صافکاری"],
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

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

function toEnglishDigits(text: string): string {
  return text
    .replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d)));
}

function normalizeText(text: string): string {
  return text
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/ة/g, "ه")
    .replace(/‌/g, " ")
    .trim();
}

function applyUnit(num: number, unit: string | undefined): number {
  if (unit === "میلیون") return Math.round(num * 1_000_000);
  if (unit === "هزار") return Math.round(num * 1_000);
  if (unit === "تومان") return Math.round(num);
  if (unit === "ت") {
    if (num < 100 && num % 1 !== 0) return Math.round(num * 1_000_000);
    return Math.round(num);
  }
  return Math.round(num);
}

function extractPriceRange(text: string): { min: number | null; max: number | null } {
  const t = toEnglishDigits(normalizeText(text));

  const rangeRe = /(\d+(?:\.\d+)?)\s*(میلیون|هزار|تومان|ت(?=\s|$))?\s*تا\s*(\d+(?:\.\d+)?)\s*(میلیون|هزار|تومان|ت(?=\s|$))?/;
  const rangeMatch = t.match(rangeRe);
  if (rangeMatch) {
    const minUnit = rangeMatch[2] ?? rangeMatch[4];
    const maxUnit = rangeMatch[4] ?? rangeMatch[2];
    const min = applyUnit(parseFloat(rangeMatch[1]), minUnit);
    const max = applyUnit(parseFloat(rangeMatch[3]), maxUnit);
    if (min !== null && max !== null && min <= max) {
      return { min, max };
    }
  }

  const singleRe = /(\d+(?:\.\d+)?)\s*(میلیون|هزار|تومان|ت(?=\s|$))/;
  const singleMatch = t.match(singleRe);
  if (singleMatch) {
    const value = applyUnit(parseFloat(singleMatch[1]), singleMatch[2]);
    if (value !== null) return { min: value, max: value };
  }

  const plainRange = t.match(/(\d[\d,]*)\s*[-–]\s*(\d[\d,]*)/);
  if (plainRange) {
    const min = parseInt(plainRange[1].replace(/,/g, ""));
    const max = parseInt(plainRange[2].replace(/,/g, ""));
    if (!isNaN(min) && !isNaN(max)) return { min, max };
  }

  const plainNumber = t.match(/(\d[\d,]*)/);
  if (plainNumber) {
    const value = parseInt(plainNumber[1].replace(/,/g, ""));
    if (!isNaN(value)) return { min: value, max: value };
  }

  return { min: null, max: null };
}

export function normalizeOfferDeterministic(rawText: string): NormalizeOfferResult {
  const normalized = normalizeText(rawText);

  let service: string | null = null;
  let servicePos = Infinity;
  let serviceConfidence = 0;

  const allServices = getAllServices();
  for (const svc of allServices) {
    const pos = normalized.indexOf(normalizeText(svc.name));
    if (pos !== -1 && pos < servicePos) {
      service = svc.name;
      servicePos = pos;
      serviceConfidence = 0.9;
    }
  }

  const GENERIC_SERVICE_TERMS = ["صافکاری", "رنگ"];

  for (const [svcName, keywords] of Object.entries(SERVICE_KEYWORDS)) {
    for (const kw of keywords) {
      if (service && GENERIC_SERVICE_TERMS.some((g) => kw.includes(g))) continue;
      const pos = normalized.indexOf(normalizeText(kw));
      if (pos !== -1 && pos < servicePos) {
        const found = allServices.find((s) => s.name === svcName);
        if (found) {
          service = found.name;
          servicePos = pos;
          serviceConfidence = 0.8;
        }
      }
    }
  }

  let carModel: string | null = null;
  for (const [brand, models] of Object.entries(CAR_BRANDS)) {
    for (const model of models) {
      const isSafe = model.length > 2 || /[a-zA-Z]/.test(model);
      if (isSafe && normalized.includes(normalizeText(model))) {
        carModel = model;
        break;
      }
      const compound = normalizeText(`${brand} ${model}`);
      if (normalized.includes(compound)) {
        carModel = model;
        break;
      }
    }
    if (carModel) break;
  }

  if (!carModel) {
    for (const model of GENERIC_MODELS) {
      if (normalized.includes(normalizeText(model))) {
        carModel = model;
        break;
      }
    }
  }

  const { min, max } = extractPriceRange(rawText);

  const includesPaint = /رنگ|تاپینگ|صافکاری/.test(normalized);

  let notes: string | null = null;
  if (/فقط صافکاری/.test(normalized)) notes = "فقط صافکاری، رنگ ندارد";
  else if (/بدون رنگ/.test(normalized)) notes = "بدون رنگ";
  else if (/شامل رنگ/.test(normalized)) notes = "شامل رنگ";

  const fields = [service, carModel, min !== null ? "price" : null].filter(Boolean).length;
  const confidence = Math.min(0.95, 0.3 + fields * 0.2 + serviceConfidence * 0.1);

  return {
    service,
    carModel,
    priceMin: min,
    priceMax: max,
    currency: "IRR",
    includesPaint,
    notes,
    confidence: Math.round(confidence * 100) / 100,
  };
}

export async function normalizeOffer(rawText: string): Promise<NormalizeOfferResult> {
  const { hasApiKey, normalizeOfferWithLLM } = await import("./client");
  if (hasApiKey()) {
    try {
      return await normalizeOfferWithLLM(rawText);
    } catch {
      return normalizeOfferDeterministic(rawText);
    }
  }
  return normalizeOfferDeterministic(rawText);
}
