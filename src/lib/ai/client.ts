import type { NormalizeOfferResult, ParseQueryResult } from "./schemas";
import { normalizeOfferResultSchema, parseQueryResultSchema } from "./schemas";

const API_URL = "https://api.anthropic.com/v1/messages";

function getApiKey(): string | null {
  return process.env.ANTHROPIC_API_KEY || null;
}

async function callClaude(
  system: string,
  user: string
): Promise<Record<string, unknown>> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 512,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Claude API error: ${response.status} ${text}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text;
  if (!text) {
    throw new Error("Claude API returned no text");
  }

  return JSON.parse(text);
}

export async function parseQueryWithLLM(query: string): Promise<ParseQueryResult> {
  const raw = await callClaude(
    `You are a Persian car repair query parser. Extract structured data from the user's message.
Return JSON only, no markdown. Fields:
- service: the repair service in Persian (e.g. "گلگیر", "رنگ", "مکانیک") or null
- carBrand: car brand (e.g. "ایران‌خودرو", "پژو") or null
- carModel: car model (e.g. "پراید", "سمند", "سراتو") or null
- city: city name or null
- intent: one of "cheapest", "nearest", "best_rated", "best_value"
- confidence: 0 to 1`,
    query
  );
  return parseQueryResultSchema.parse(raw);
}

export async function normalizeOfferWithLLM(rawText: string): Promise<NormalizeOfferResult> {
  const raw = await callClaude(
    `You are a Persian car repair price normalizer. Parse messy price text into structured data.
Return JSON only, no markdown. Fields:
- service: service name in Persian or null
- carModel: car model or null
- priceMin: minimum price in Toman (number) or null
- priceMax: maximum price in Toman (number) or null
- currency: always "IRR"
- includesPaint: true if paint is included
- notes: any extra notes or null
- confidence: 0 to 1`,
    rawText
  );
  return normalizeOfferResultSchema.parse(raw);
}

export function hasApiKey(): boolean {
  return getApiKey() !== null;
}
