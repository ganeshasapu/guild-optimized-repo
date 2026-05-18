# Guild-Optimized Repo — Agent Development Guide

## Quick Reference

- **Stack**: Next.js 15 (App Router), Drizzle ORM, Neon PostgreSQL, Tailwind CSS v4, shadcn/ui, TypeScript
- **Monorepo**: Turborepo with pnpm workspaces
- **Node**: 22+ (see .nvmrc)
- **Agent Pipeline**: Guild.AI (see workspace context for pipeline details)

## Commands

### Agent Workflow
- `pnpm agent:verify` — Full pipeline: typecheck → lint → test → build

### Development
- `pnpm dev` — Start all dev servers
- `pnpm build` — Build all packages
- `pnpm typecheck` — TypeScript checking across all packages
- `pnpm lint` — ESLint across all packages
- `pnpm test` — Run all Vitest tests
- `pnpm db:generate` — Generate Drizzle migrations
- `pnpm db:migrate` — Run migrations

### Scoped Commands
- `pnpm --filter=@guild-optimized/domain-NAME test` — Run tests for one domain
- `pnpm --filter=@guild-optimized/web dev` — Dev server for web only

## Architecture

### Package Dependency Graph
```
apps/web
  ├── @guild-optimized/ui
  ├── @guild-optimized/db
  ├── @guild-optimized/shared
  └── @guild-optimized/domain-*
        ├── @guild-optimized/ui
        ├── @guild-optimized/db
        └── @guild-optimized/shared
```

Domain packages never import from each other.

### Domain Packages

Each domain (`packages/domain-*`) is a self-contained feature boundary:
- `src/routes/` — Page components (re-exported by apps/web)
- `src/components/` — Domain-specific React components
- `src/services/` — Business logic (database queries, data processing)
- `src/actions/` — Next.js Server Actions
- `src/types/` — TypeScript types for this domain
- `src/lib/` — Validation schemas (Zod), domain utilities
- `__tests__/unit/` — Unit tests (mocked DB)
- `__tests__/integration/` — Integration tests (real Neon branch DB)
- `__tests__/fixtures/` — Test data

### Adding a New Domain Package

1. Create `packages/domain-NAME/` with the structure above
2. Add `CLAUDE.md` with package-specific conventions
3. Add `@guild-optimized/domain-NAME` to `apps/web/package.json`
4. Add to `transpilePackages` in `apps/web/next.config.ts`
5. Re-export routes from `apps/web/app/(domains)/NAME/`

### Adding a New Route from a Domain

1. Create the page component in `packages/domain-NAME/src/routes/`
2. Re-export from `apps/web/app/(domains)/` with a one-line file:
   ```tsx
   export { default } from "@guild-optimized/domain-NAME/routes/page";
   ```

## Conventions

### TypeScript
- Strict mode everywhere (`noUncheckedIndexedAccess: true`)
- Use `type` imports: `import type { Foo } from "./bar"`
- No `any` — use `unknown` and narrow

### Naming
- Files: kebab-case (`user-service.ts`, `user-card.tsx`)
- Types/Interfaces: PascalCase (`UserProfile`, `CreateUserInput`)
- Functions/variables: camelCase (`getUserById`, `isActive`)
- Constants: UPPER_SNAKE_CASE (`DEFAULT_PAGE_SIZE`)
- Database tables: snake_case (`user_profiles`)

### Imports
- External packages first, then internal packages, then relative imports
- Always separate groups with blank lines
- Use package imports (`@guild-optimized/db`) not relative paths across packages

### Server Actions
- One action per file in `src/actions/`
- Validate input with Zod schema from `src/lib/`
- Return `{ success: true, data }` or `{ success: false, error }` — never throw

### Testing
- Unit tests mock the database via `vi.mock("@guild-optimized/db", ...)`
- Integration tests use `describe.skipIf(!process.env.DATABASE_URL)` guard
- Test files match source: `user.service.ts` → `user.service.test.ts`
- Every service function needs at least one unit test

### Database
- All schema changes go in `packages/db/src/schema/`
- After schema changes: `cd packages/db && npx drizzle-kit generate` then `npx drizzle-kit migrate`
- Never modify existing migration files
- Use `getDb()` from `@guild-optimized/db` — never construct clients directly
- Queries live in `src/services/`, not in components or actions

### Components
- Use `@guild-optimized/ui` for base components (Button, Input, Card, etc.)
- Domain components live in `packages/domain-NAME/src/components/`
- Use the `cn()` utility from `@guild-optimized/ui` for className merging
- Icons: `lucide-react` only
- Colors: semantic tokens (`bg-primary`, `text-muted-foreground`) — never raw palette values
