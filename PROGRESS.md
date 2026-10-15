# PROGRESS.md

> Paste this file to the AI agent at the start of a new session so it knows where we are.
> Update it after every completed task.

## Current status

**Phase:** 2, AI core — done
**Last updated:** 2026-10-16
**Summary:** Persian NLP query parser (service/car/city/intent), price normalizer (ranges, Persian digits, units), Zod schemas, 53-case eval set at 100%, 29 tests passing.

## Git

- Repo: https://github.com/pouyanAghajani/FixFair
- Last commit: `4239a1d` feat: add Tehran car repair dataset with repositories and tests
- Pending: none

## Next step

Phase 2: AI core — query parser, normalization pipeline, Zod schemas, evaluation set (50 cases)

## Key decisions

| Decision            | Choice                                     | Why                                                            |
| ------------------- | ------------------------------------------ | -------------------------------------------------------------- |
| Market              | Car repair price comparison                | Fits Torob's challenge, differentiated from "airplane tickets" |
| Scope               | One city (Tehran)                          | Depth beats breadth; 1 good city > 10 empty ones               |
| Price display       | Min-max range                              | Repair prices vary by damage and car model                     |
| Data source         | Manual collection + optional official APIs | Safe, honest, enough for a demo                                |
| Drivers / transport | Out of scope                               | Separate marketplace, doesn't fit a 5-minute demo              |
| Torob crawling      | Never                                      | Bad idea for a Torob applicant                                 |
| Next.js version    | 15.3.4 (latest)                            | App Router, stable                                             |
| Tailwind version    | v4 (CSS-based config)                      | Modern, no separate config file needed                         |
| Font                | Vazirmatn (self-hosted woff2)              | Works offline, no CDN dependency, good for Iran                |
| Data storage        | JSON files (Postgres-ready interface)      | No Postgres server available; easy to swap later               |
| Data realism        | Synthetic but market-informed              | Honest about being synthetic; realistic for demo               |

## Roadmap

### Phase 0: Setup

- [x] Create repo and project (Next.js, TS, Tailwind, shadcn/ui) — scaffolded, shadcn deferred to Phase 4
- [x] Add RTL + Vazirmatn font — self-hosted woff2, `dir="rtl"`, `lang="fa"`
- [x] Set up env variables and `.gitignore` — `.env.example` created, `.gitignore` covers `.env`, `node_modules`, `.next`
- [x] Push to GitHub — done by user

### Phase 1: Data

- [x] Define DB schema (`shops`, `services`, `price_offers`, `reviews`) — TypeScript types in `src/types/`
- [x] Collect 100-300 price records for Tehran (manual) — 259 synthetic offers generated
- [x] Mark each record real or synthetic — all marked `isReal: false`
- [x] Seed script to load data — `src/db/seed.ts` validates referential integrity

### Phase 2: AI core (the heart of the project)

- [x] Query parser: natural language to `{service, car, city, intent}` — deterministic Persian NLP engine + optional LLM path
- [x] Normalization pipeline: messy text to standard record — Persian digit conversion, price ranges, unit handling
- [x] Zod schemas for all LLM outputs — parseQuery, normalizeOffer, explainResult
- [x] Evaluation set (50 cases) + accuracy report — 53 cases, 100% accuracy

### Phase 3: Search and ranking

- [ ] Search API
- [ ] Ranking by intent (cheapest, nearest, best rated, best value)
- [ ] AI explanation of the best choice
- [ ] Suspicious price detection (vs market average)

### Phase 4: UI

- [ ] Search page (RTL, clean)
- [ ] Results list with price ranges
- [ ] Map view (MapLibre)
- [ ] Simple rating

### Phase 5: Demo and delivery

- [ ] Deploy (live link)
- [ ] Write README with architecture and data notes
- [ ] "How it works" page
- [ ] Record 5-minute demo video
- [ ] Submit on jobs.torob.com

### Optional (only if time remains)

- [ ] Estimated shipping price module (calculation only)

## Done log

| Date | What was done |
| ---- | ------------- |
| 2026-10-16 | Phase 0: git init, .gitignore, Next.js 15 + TS + Tailwind v4, RTL + Vazirmatn, .env.example, vitest |
| 2026-10-16 | Phase 1: types, data generator, 259 offers / 59 shops / 20 services / 150 reviews, repositories, seed validator, 13 tests |
| 2026-10-16 | Phase 2: query parser, normalizer, Zod schemas, LLM client, 53-case eval at 100%, 29 tests |

## Problems / open questions

- Data is synthetic (marked `isReal: false`). For the demo this is fine and honest.

## Notes for the demo video

Ideas to show in the 5 minutes:

1. The problem: people get overcharged on repairs
2. Type a messy query, show the AI understanding it
3. Show messy raw data becoming clean records
4. Ranked results + the explanation of the best choice
5. Map
6. Evaluation numbers
7. Future: more cities, mechanics claiming profiles, drivers/transport
