# Guild-Optimized Repo

A Next.js monorepo optimized for autonomous agent development, powered by [Guild.AI](https://app.guild.ai).

## Stack

- **Framework:** Next.js 15 (App Router)
- **ORM:** Drizzle ORM
- **Database:** Neon PostgreSQL
- **Styling:** Tailwind CSS v4, shadcn/ui
- **Language:** TypeScript (strict mode)
- **Monorepo:** Turborepo with pnpm workspaces

## Getting Started

```bash
pnpm install
pnpm dev
```

## Agent Pipeline

This repo is managed by a Guild.AI agent pipeline. Agents implement Linear tickets, review PRs, and fix CI failures autonomously.

## Project Structure

```
apps/web                    → Next.js application
packages/db                  → Drizzle schema, migrations, client
packages/shared             → Cross-domain types and utilities
packages/ui                  → shadcn/ui component library
packages/config-eslint      → Shared ESLint configuration
packages/config-typescript  → Shared TypeScript configuration
packages/config-tailwind    → Shared Tailwind preset
packages/domain-*           → Domain packages (created by agents)
```
<!-- Optimized for Guild AI workflows -->
