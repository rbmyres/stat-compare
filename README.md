# StatCompare

NFL statistics comparison platform covering every season from 1999 to present. Browse player and team leaderboards, view detailed stat profiles, and compare entities side-by-side.

## Architecture

```
nflverse API  →  ETL (R)  →  PostgreSQL  →  Next.js Frontend
```

## Project Structure

| Directory | Purpose |
|-----------|---------|
| `stats-app/` | Next.js web application ([README](stats-app/README.md)) |
| `database/` | PostgreSQL schema, functions, and policies ([README](database/README.md)) |
| `etl/` | R pipeline that extracts and loads NFL data ([README](etl/README.md)) |
| `scripts/` | Deployment script for production VPS |

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Database**: PostgreSQL with stored functions for stat aggregation
- **ETL**: R with nflreadr, loading play-by-play data into weekly stat tables
- **Infrastructure**: AWS Lightsail, Nginx, PM2, Certbot

## Quick Start (Development)

**Prerequisites**: Node.js 20+, PostgreSQL, R 4.0+ (for ETL only)

1. **Set up the database** — run the SQL scripts in order:
   ```bash
   psql -d stats_db -f database/setup_database.sql
   ```

2. **Load data** — run the ETL pipeline (see [etl/README.md](etl/README.md))

3. **Open an SSH tunnel** to the production database (if not running locally):
   ```bash
   ssh -L 5433:localhost:5432 lightsail
   ```

4. **Configure environment** — copy and fill in credentials:
   ```bash
   cp stats-app/.env.example stats-app/.env.local
   ```

5. **Start the dev server**:
   ```bash
   cd stats-app
   npm install
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).