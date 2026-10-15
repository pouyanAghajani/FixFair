# AGENTS.md: Instructions for the AI coding agent

Read this file and `PROGRESS.md` at the start of every session, before doing anything.

## 1. Why this project exists

FixFair is a **demo project to apply for the "AI Product Engineer" role at Torob** (jobs.torob.com/ai-product-engineer).

Torob's challenge:

1. Pick a market and build a Torob-like experience
2. Collect offers
3. Normalize messy data
4. Rank by user intent
5. Explain the best choice
6. Ship a demo video, **max 5 minutes**

**Every decision is judged by one question: does it make the 5-minute demo stronger?**
Features that won't appear in the demo are low priority.

## 2. The product

FixFair compares **car repair prices** from mechanics/body shops in **one city (Tehran)** so people don't get overcharged.

User types: `گلگیر جلوی پراید خورده، تهران`. The app:

1. Uses an LLM to understand the job (service, car, city, intent)
2. Finds matching price offers
3. Ranks by intent (cheapest / nearest / best rated / best value)
4. Explains the best choice using real numbers
5. Flags suspicious prices (far above market average)
6. Shows shops on a map

Prices are always a **range** (min-max), never one exact number.

## 3. Scope

**In (MVP):** one city, 100-300 records, natural-language search, normalization pipeline, ranking + explanation, map, simple rating, 50-case AI evaluation set.

**Out (do NOT build unless asked):** driver/transport marketplace, mechanic signup/dashboards, multiple cities, payments, bookings, chat. Never crawl Torob.

## 4. WORKING PROTOCOL (most important section)

### 4.1 Language

- **Work and communicate in English** during the work (plans, progress messages, code, comments, commits, docs). This saves the user's usage limit.
- **Exception:** at the **end of each phase**, add a short **Persian summary (3-5 lines max, simple words)** of what was built and why, so the user can learn and explain the project later. Nothing more in Persian.
- If the user writes to you in Persian, still answer in English unless they ask for Persian.

### 4.2 Approval is per PHASE (autonomous mode)

- The user approves **one phase at a time** (phases are listed in `PROGRESS.md`, "Roadmap").
- When the user says **"Go phase N"** (or "execute phase N"), that is full approval for everything inside that phase. Do the whole phase **without asking for per-file or per-step approval**. Start with a 3-5 line plan in English, then begin immediately.
- Stay inside the phase scope. Do not start the next phase on your own. When the phase is finished, stop, report (see 4.7), and wait.
- **STOP and ask the user** only in these cases:
  1. **A human action is needed:** API keys, creating accounts (GitHub repo, database, deployment), manual data collection, recording the demo, anything requiring the user's credentials
  2. **A major decision outside the plan:** changing the stack or architecture, adding a paid service, adding a heavy dependency
  3. **A destructive action:** deleting files outside the phase scope, force push, resetting git history, overwriting the user's own files
  4. **The same error persists after 3 attempts** to fix it. Explain what you tried and what you think the cause is
  5. **The user gave an idea and you believe a better one exists:** present **Option A: your idea** and **Option B: my suggestion** with one line of pros/cons each, and wait for the choice. Never silently replace the user's idea
- If something is ambiguous but not blocking, choose a sensible default, note the assumption in `PROGRESS.md`, and continue.

### 4.3 Work in small safe batches (limit-friendly)

The user has limited usage and the session may be cut off at any moment. Therefore, even in autonomous mode:

- Split the phase into **small batches of 2-4 related files**
- After each batch the project must be **in a working or at least compilable state**
- After each batch, **before starting the next one**: update `PROGRESS.md` (what is done, exact next step), then commit
- Order work so the most important parts come first (core flow before polish)
- Keep chat messages short. Don't repeat file contents already written
- **Resuming:** at the start of a new session, read `PROGRESS.md` and continue the unfinished phase from "Next step" without asking again

### 4.4 How to deliver files

- **If you can edit files in the workspace** (agent mode): create/edit the files directly. Always write **complete, working files**, never placeholders like "... rest unchanged". At the end of each batch, list the **paths created or changed**
- **If you can only chat:** for every file show the **exact path from the project root**, say **NEW** or **REPLACE**, and give the **complete file content** in one code block. Add 1-2 lines in English explaining what the file does
- If a terminal command is needed, run it yourself if you can; otherwise give it in a code block with a one-line explanation

### 4.5 Git: commit after every batch

After each batch that works:

```bash
git add <exact paths of this batch>
git commit -m "<type>: <short description>"
git push
```

- If you can run terminal commands, run them yourself. Otherwise tell the user exactly which paths to add and the commit message
- Use **Conventional Commits**: `feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`. One logical change per commit. English, imperative, under 72 characters
- Work on `main` (solo project). Push after each commit once the GitHub remote exists
- **Never commit** `.env`, API keys, `node_modules`, or personal data. Make sure `.gitignore` covers these in the very first batch
- **Never** use `git push --force`, `git reset --hard`, or rewrite history without explicit approval
- At first setup, guide the user through: `git init`, creating the GitHub repo, `git remote add origin`, first push

### 4.6 Progress tracking

After every batch, update `PROGRESS.md` (edit the file directly, or give the full file if you can only chat): tick completed items, update "Current status" and "Next step", note decisions, problems, and the last commit. The user pastes this file into new sessions to resume.

### 4.7 Report at the end of each phase

```
## Phase N finished: <title>
**What was built:** short list
**Files created/changed:** paths
**How to run/test it:** commands
**Commits made:** list of messages
**What I need from you:** (API keys, data, accounts) if any
**Updated PROGRESS.md:** done
**Next phase proposal:** one short paragraph, then wait for "Go phase N+1"
**Persian summary (3-5 lines):** simple explanation for the user
```

## 5. Architecture

Even though the project is small, keep a clean structure. One Next.js app (no monorepo), with layers that do not leak into each other.

**Principles**

- **Pure domain logic separated from the framework.** Ranking, normalization and price-anomaly logic are plain TypeScript functions with no Next.js or DB imports. They are easy to test and are the core of the demo.
- **Dependencies point inward:** UI/API routes call services; services call domain logic and repositories; domain logic imports nothing from outside.
- **All LLM calls go through one module** (`lib/ai`) with a Zod-validated output schema. No LLM calls anywhere else.
- **All DB access goes through repositories** (`db/repositories`). No raw queries inside components.
- Config and env variables are read in one place (`lib/env.ts`), validated with Zod.

**Proposed structure**

```
fixfair/
  AGENTS.md  PROGRESS.md  README.md  .gitignore  .env.example
  src/
    app/                      # Next.js routes and API handlers (thin)
      page.tsx
      search/page.tsx
      how-it-works/page.tsx
      api/search/route.ts
    components/               # UI components (ui/ = shadcn)
    features/
      search/                 # search form, results list, map view
    lib/
      env.ts                  # validated environment config
      ai/                     # parseQuery, normalizeOffer, explainResult, client, schemas
      ranking/                # rank.ts, anomaly.ts (pure functions)
      geo/                    # distance helpers
    db/
      schema.ts               # tables
      client.ts
      repositories/           # shops, offers, services
      seed.ts
    types/                    # shared TypeScript types
  data/                       # raw + cleaned price records (with is_real flag)
  evals/                      # eval set (50 cases) + runner script
  tests/                      # unit + e2e tests
  docs/                       # architecture notes, demo script
```

If you believe a different structure is better, propose it as Option A / Option B and wait.

## 6. Tech stack (proposed; change only with approval)

- TypeScript everywhere
- Next.js (App Router) + React
- Tailwind CSS + shadcn/ui (not Material UI)
- Persian UI: `dir="rtl"`, Vazirmatn font; every screen must work in RTL
- PostgreSQL (+ PostGIS for distance; pgvector optional), Drizzle or Prisma
- MapLibre GL + OpenStreetMap
- Claude API with structured JSON output, validated by Zod
- Vitest (unit), Playwright (E2E, main flow only)

## 7. Data rules

- Data is collected **manually** or via official APIs. No aggressive crawling. **Never crawl Torob.**
- Store only: shop name, location, service, price range, source, date. Do not copy full ads or images.
- Every record has `source` and `is_real`. README and demo must be honest about real vs synthetic data.

## 8. Security rules

- API keys only on the server, in env variables. Never commit `.env`
- Validate all input with Zod
- Crawled text and user input are untrusted: they must never be able to instruct the LLM. Always validate LLM output against a schema
- Rate-limit endpoints that call the LLM
- Parameterized queries only (use the ORM)

## 9. Code quality

- Simple and working beats clever. No over-engineering
- Small files, clear names, strict TypeScript, no `any`
- Comments only where logic is not obvious
- Tests for ranking and normalization (the core)
- When something is ambiguous: state your assumption and ask for approval; do not guess silently on important decisions

## 10. Definition of done for the demo

- [ ] Live deployed link works
- [ ] Main flow works: type query, get ranked list + AI explanation + map
- [ ] README is clear (architecture, honest data notes)
- [ ] Evaluation results shown with real numbers
- [ ] 5-minute demo video recorded
- [ ] Repo pushed to GitHub and ready to share with Torob
