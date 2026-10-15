import type { NormalizeOfferResult, ParseQueryResult } from "@/lib/ai/schemas";

export interface ParseQueryCase {
  type: "parse_query";
  input: string;
  expected: Partial<ParseQueryResult>;
}

export interface NormalizeOfferCase {
  type: "normalize_offer";
  input: string;
  expected: Partial<NormalizeOfferResult>;
}

export type EvalCase = ParseQueryCase | NormalizeOfferCase;

export const evalCases: EvalCase[] = [
  { type: "parse_query", input: "گلگیر جلوی پراید خورده، تهران", expected: { service: "گلگیر", carModel: "پراید", city: "تهران" } },
  { type: "parse_query", input: "رنگ کامل سمند در تهران", expected: { service: "رنگ کامل", carModel: "سمند", city: "تهران" } },
  { type: "parse_query", input: "ارزان‌ترین تعمیر گلگیر پراید", expected: { service: "گلگیر", carModel: "پراید", intent: "cheapest" } },
  { type: "parse_query", input: "نزدیک‌ترین تعمیرگاه برق تهران", expected: { service: "برق", city: "تهران", intent: "nearest" } },
  { type: "parse_query", input: "بهترین امتیاز تعمیر موتور پژو ۲۰۶", expected: { service: "موتور", carModel: "۲۰۶", intent: "best_rated" } },
  { type: "parse_query", input: "کولر گازی کیا سراتو تهران", expected: { service: "کولر", carModel: "سراتو", city: "تهران" } },
  { type: "parse_query", input: "ترمز سمند ارزان", expected: { service: "ترمز", carModel: "سمند", intent: "cheapest" } },
  { type: "parse_query", input: "صافکاری و رنگ گلگیر پراید", expected: { service: "گلگیر", carModel: "پراید" } },
  { type: "parse_query", input: "تعمیر شیشه جلو تویوتا کرولا", expected: { service: "شیشه جلو", carModel: "کرولا" } },
  { type: "parse_query", input: "گیربکس پژو ۲۰۷ تهران", expected: { service: "گیربکس", carModel: "۲۰۷", city: "تهران" } },
  { type: "parse_query", input: "لاستیک و چرخ سایپا پراید", expected: { service: "لاستیک", carModel: "پراید" } },
  { type: "parse_query", input: "تعلیق هیوندای آوانته", expected: { service: "تعلیق", carModel: "آوانته" } },
  { type: "parse_query", input: "باتری ماشین سمند", expected: { service: "باتری", carModel: "سمند" } },
  { type: "parse_query", input: "دینام پراید ۱۳۱", expected: { service: "دینام", carModel: "پراید" } },
  { type: "parse_query", input: "رادیاتور میتسوبیشی لنسر", expected: { service: "رادیاتور", carModel: "لنسر" } },
  { type: "parse_query", input: "کاپوت چانگان CS35 تهران", expected: { service: "کاپوت", carModel: "CS35", city: "تهران" } },
  { type: "parse_query", input: "سپر جلو رنو کپچر", expected: { service: "سپر", carModel: "کپچر" } },
  { type: "parse_query", input: "درب عقب سمند ارزان‌ترین", expected: { service: "درب", carModel: "سمند", intent: "cheapest" } },
  { type: "parse_query", input: "برق خودرو پژو پارس تهران", expected: { service: "برق", carModel: "پارس", city: "تهران" } },
  { type: "parse_query", input: "موتور کیا سراتو بهترین کیفیت", expected: { service: "موتور", carModel: "سراتو", intent: "best_rated" } },
  { type: "parse_query", input: "وایپر جلو تویوتا کمری", expected: { service: "شیشه جلو", carModel: "کمری" } },
  { type: "parse_query", input: "رنگ جزئی گلگیر پراید", expected: { service: "رنگ جزئی", carModel: "پراید" } },
  { type: "parse_query", input: "گلگیر عقب ساینا تهران", expected: { service: "گلگیر", carModel: "ساینا", city: "تهران" } },
  { type: "parse_query", input: "تعمیر کامل موتور مزدا ۳", expected: { service: "موتور", carModel: "۳" } },
  { type: "parse_query", input: "ترمز دیسکی ب‌ام‌و سری ۳", expected: { service: "ترمز", carModel: "سری ۳" } },
  { type: "parse_query", input: "کولر گازی هیوندای سانتافه", expected: { service: "کولر", carModel: "سانتافه" } },
  { type: "parse_query", input: "شیشه جانبی نیسان آریا", expected: { service: "شیشه جانبی", carModel: "آریا" } },
  { type: "parse_query", input: "تعویض درب جلو چانگان CS55", expected: { service: "درب", carModel: "CS55" } },
  { type: "parse_query", input: "صافکاری سپر عقب پراید", expected: { service: "سپر", carModel: "پراید" } },
  { type: "parse_query", input: "تعمیر برق و فیوز رنو سیمبل", expected: { service: "برق", carModel: "سیمبل" } },
  { type: "parse_query", input: "رنگ و صافکاری کاپوت کیا اپتیما", expected: { service: "کاپوت", carModel: "اپتیما" } },
  { type: "parse_query", input: "گیربکس اتوماتیک تویوتا کرولا", expected: { service: "گیربکس", carModel: "کرولا" } },
  { type: "parse_query", input: "لنت ترمز مزدا ۲ ارزان", expected: { service: "ترمز", carModel: "۲", intent: "cheapest" } },
  { type: "parse_query", input: "سوپاپ موتور پژو ۳۰۱", expected: { service: "موتور", carModel: "۳۰۱" } },
  { type: "parse_query", input: "تعویض شیشه عقب میتسوبیشی پاجرو", expected: { service: "شیشه عقب", carModel: "پاجرو" } },
  { type: "parse_query", input: "تعمیر سیستم تعلیق رنو مگان", expected: { service: "تعلیق", carModel: "مگان" } },
  { type: "parse_query", input: "دینام و باتری سمند", expected: { service: "دینام", carModel: "سمند" } },
  { type: "parse_query", input: "رادیاتور و ترموستات کیا اسپورتیج", expected: { service: "رادیاتور", carModel: "اسپورتیج" } },
  { type: "parse_query", input: "کاپوت و درب جلو هیوندای توسان", expected: { service: "کاپوت", carModel: "توسان" } },
  { type: "parse_query", input: "گلگیر جلو و رنگ پراید ۱۳۲", expected: { service: "گلگیر", carModel: "پراید" } },
  { type: "parse_query", input: "تعمیر کولر و برودت سایپا کوییک", expected: { service: "کولر", carModel: "کوییک" } },
  { type: "parse_query", input: "صافکاری و تاپینگ درب عقب چانگان EADO", expected: { service: "رنگ جزئی", carModel: "EADO" } },
  { type: "parse_query", input: "ترمز و لنت ب‌ام‌و سری ۵", expected: { service: "ترمز", carModel: "سری ۵" } },
  { type: "parse_query", input: "شیشه جلو و وایپر نیسان ایکس‌تریل", expected: { service: "شیشه جلو", carModel: "ایکس‌تریل" } },
  { type: "parse_query", input: "موتور و سوپاپ تویوتا لندکروزر", expected: { service: "موتور", carModel: "لندکروزر" } },
  { type: "normalize_offer", input: "گلگیر ۲ میلیون با رنگ", expected: { service: "گلگیر", priceMin: 2000000, priceMax: 2000000, includesPaint: true } },
  { type: "normalize_offer", input: "صافکاری+رنگ گلگیر: ۲.۵ت", expected: { service: "گلگیر", priceMin: 2500000, priceMax: 2500000, includesPaint: true } },
  { type: "normalize_offer", input: "گلگیر پراید ۱.۵ تا ۲ میلیون", expected: { service: "گلگیر", carModel: "پراید", priceMin: 1500000, priceMax: 2000000 } },
  { type: "normalize_offer", input: "رنگ کامل سمند ۱۵ میلیون", expected: { service: "رنگ کامل", carModel: "سمند", priceMin: 15000000, priceMax: 15000000 } },
  { type: "normalize_offer", input: "کولر گازی ۵۰۰ هزار تا ۱ میلیون", expected: { service: "کولر", priceMin: 500000, priceMax: 1000000 } },
  { type: "normalize_offer", input: "ترمز پژو ۲۰۶ ۸۰۰۰۰۰ تومان", expected: { service: "ترمز", carModel: "۲۰۶", priceMin: 800000, priceMax: 800000 } },
  { type: "normalize_offer", input: "شیشه جلو تویوتا کرولا ۱.۲ میلیون تا ۱.۸ میلیون", expected: { service: "شیشه جلو", carModel: "کرولا", priceMin: 1200000, priceMax: 1800000 } },
  { type: "normalize_offer", input: "گیربکس رنو سیمبل ۵ میلیون", expected: { service: "گیربکس", carModel: "سیمبل", priceMin: 5000000, priceMax: 5000000 } },
];
