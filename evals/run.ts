import { parseQueryDeterministic } from "@/lib/ai/parse-query";
import { normalizeOfferDeterministic } from "@/lib/ai/normalize-offer";
import type { EvalCase } from "./cases";
import { evalCases } from "./cases";

function evaluateCase(evCase: EvalCase): { passed: boolean; detail: string } {
  if (evCase.type === "parse_query") {
    const result = parseQueryDeterministic(evCase.input);
    const expected = evCase.expected;

    if (expected.service !== undefined && result.service !== expected.service) {
      return { passed: false, detail: `service: got "${result.service}", want "${expected.service}"` };
    }
    if (expected.carModel !== undefined && result.carModel !== expected.carModel) {
      return { passed: false, detail: `carModel: got "${result.carModel}", want "${expected.carModel}"` };
    }
    if (expected.city !== undefined && result.city !== expected.city) {
      return { passed: false, detail: `city: got "${result.city}", want "${expected.city}"` };
    }
    if (expected.intent !== undefined && result.intent !== expected.intent) {
      return { passed: false, detail: `intent: got "${result.intent}", want "${expected.intent}"` };
    }
    return { passed: true, detail: "ok" };
  } else {
    const result = normalizeOfferDeterministic(evCase.input);
    const expected = evCase.expected;

    if (expected.service !== undefined && result.service !== expected.service) {
      return { passed: false, detail: `service: got "${result.service}", want "${expected.service}"` };
    }
    if (expected.carModel !== undefined && result.carModel !== expected.carModel) {
      return { passed: false, detail: `carModel: got "${result.carModel}", want "${expected.carModel}"` };
    }
    if (expected.priceMin !== undefined && result.priceMin !== expected.priceMin) {
      return { passed: false, detail: `priceMin: got ${result.priceMin}, want ${expected.priceMin}` };
    }
    if (expected.priceMax !== undefined && result.priceMax !== expected.priceMax) {
      return { passed: false, detail: `priceMax: got ${result.priceMax}, want ${expected.priceMax}` };
    }
    if (expected.includesPaint !== undefined && result.includesPaint !== expected.includesPaint) {
      return { passed: false, detail: `includesPaint: got ${result.includesPaint}, want ${expected.includesPaint}` };
    }
    return { passed: true, detail: "ok" };
  }
}

const results = evalCases.map((c) => ({ input: c.input, ...evaluateCase(c) }));

const passed = results.filter((r) => r.passed).length;
const total = results.length;

console.log(`\n=== Evaluation Results ===`);
console.log(`Passed: ${passed}/${total} (${Math.round((passed / total) * 100)}%)\n`);

const failures = results.filter((r) => !r.passed);
if (failures.length > 0) {
  console.log(`Failures (${failures.length}):`);
  for (const f of failures) {
    console.log(`  - "${f.input}": ${f.detail}`);
  }
  console.log();
}

const byType = {
  parse_query: results.filter((_, i) => evalCases[i].type === "parse_query"),
  normalize_offer: results.filter((_, i) => evalCases[i].type === "normalize_offer"),
};

for (const [type, cases] of Object.entries(byType)) {
  const p = cases.filter((r) => r.passed).length;
  console.log(`${type}: ${p}/${cases.length} (${Math.round((p / cases.length) * 100)}%)`);
}

if (failures.length > 0) {
  process.exit(1);
}
