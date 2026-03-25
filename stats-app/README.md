# StatCompare Frontend

Next.js web application for browsing and comparing NFL statistics.

## Stack

- **Next.js 16** (App Router) with React 19 and TypeScript
- **Tailwind CSS v4** with custom NFL theme colors
- **PostgreSQL** via `pg` — no ORM, direct queries with stored functions
- **nuqs** for URL search param sync, **zod** for validation
- **Vitest** + Testing Library for unit tests, **Playwright** for E2E

## Getting Started

**Prerequisites**: Node.js 20+, access to a PostgreSQL database with the stat-compare schema

1. Copy the example env file and fill in your database credentials:
   ```bash
   cp .env.example .env.local
   ```
   For development against the production DB, open an SSH tunnel first:
   ```bash
   ssh -L 5433:localhost:5432 lightsail
   ```

2. Install dependencies and start the dev server:
   ```bash
   npm install
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
├── api/search/           # GET /api/search?q=&type= (rate-limited)
├── players/              # Leaderboards: passing, rushing, receiving, overview
│   └── [id]/             # Player detail page
├── teams/                # Leaderboards: passing, rushing, overview, situational
│   └── [id]/             # Team detail page
├── compare/              # Side-by-side comparison with export (PNG/CSV/Print)
├── glossary/             # Stat definitions reference
└── layout.tsx            # Root layout: Navbar, DateRangeFilter, NuqsAdapter

components/
├── Navbar.tsx            # Sticky nav with search and mobile menu
├── SearchBar.tsx         # Live autocomplete (players + teams)
├── StatTooltip.tsx       # Hover/focus/touch tooltip for stat definitions
├── filters/              # DateRangeFilter, YearSelect, WeekSelect, SeasonTypeToggle
├── players/              # SortableStatsTable, StatsPageClient, PositionFilter
├── teams/                # SortableTeamTable, TeamStatsPageClient, OffDefToggle
└── compare/              # CompareClient, EntitySelector, StatPicker, ComparisonTable

lib/
├── db.ts                 # pg Pool singleton with error handling
├── cached-queries.ts     # React cache()-wrapped query functions
├── columns.ts            # Player column definitions (9 arrays)
├── team-columns.ts       # Team column definitions (14 arrays)
├── types/                # PlayerStats (~135 cols), TeamStats (~252 cols)
├── filters/              # nuqs parsers, zod validation, toDbParams()
├── stat-definitions.ts   # ~160 stat descriptions for tooltips/glossary
└── utils/                # cn() class merging, number formatting
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build (standalone output) |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run E2E tests (Playwright) |

## Key Patterns

- **Server Components** query the database via `cached-queries.ts` — React `cache()` deduplicates calls within a request
- **URL-driven filters** via nuqs with `shallow: false` to trigger server re-renders on filter change
- **ColumnDef arrays** drive sortable tables — `label`, `key`, and `format` function per column
- **Standalone output** (`next.config.ts`) for production — requires copying `.next/static` and `public` into the standalone directory after build
- **Null values** display as "—" (em dash), never "0" — all formatting functions handle null safely

## Deployment

See the root [scripts/deploy.sh](../scripts/deploy.sh) for the production deploy workflow.
