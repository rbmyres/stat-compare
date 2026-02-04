-- Complete Database Setup Script
-- Run this script to set up the entire NFL statistics database

-- This script should be run in the following order:
-- 1. schema.sql (creates tables and indexes)
-- 2. policies.sql (sets up RLS policies)
-- 3. views.sql (creates views)
-- 4. functions.sql (creates query functions)

\echo 'Starting NFL Database Setup...'

\echo '1. Creating schema (tables, indexes, constraints)...'
\i schema.sql

\echo '2. Setting up Row Level Security policies...'
\i policies.sql

\echo '3. Creating views...'
\i views.sql

\echo '4. Creating functions...'
\i functions.sql

\echo 'Database setup complete!'
\echo 'You can now run your ETL pipeline to load data.'