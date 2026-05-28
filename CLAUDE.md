# Guild-Optimized Repo — Agent Development Guide

## Quick Reference

- **Stack**: Next.js 15 (App Router), Drizzle ORM, Neon PostgreSQL, Tailwind CSS v4, shadcn/ui, TypeScript
- **Monorepo**: Turborepo with pnpm workspaces
- **Node**: 22+ (see .nvmrc)
- **Agent Pipeline**: Guild.AI (see workspace context for pipeline details)

## Commands

### Agent Workflow

**Available tools:**
- `pnpm agent:verify` — Full pipeline: typecheck → lint → test → build → runtime smoke tests
- `pnpm agent:check-ui` — Runtime verification: build, start server, Playwright smoke tests
- `pnpm agent:screenshot "/,/some-route"` — Take screenshots of specific routes (saved to `e2e/screenshots/`). View with the Read tool.
- `pnpm agent:playwright e2e/scratch.spec.ts` — Run an arbitrary Playwright script (for interactive scenarios like opening dialogs, filling forms). Write the script, run it, then view screenshots with the Read tool.

All agent tools auto-detect a free port — they never kill existing processes on port 3000.

**REQUIRED: UI development workflow.** When building or modifying any UI, you MUST follow this loop:

1. Read `DESIGN.md` before writing any code — it defines layout, component patterns, spacing, and color tokens.
2. Make your changes.
3. Run `pnpm typecheck && pnpm lint` — fix any errors before continuing.
4. Run `pnpm agent:screenshot` with the routes you changed to take screenshots.
5. View each screenshot using the Read tool. Evaluate: is it polished? aligned? does spacing look right? are there visual issues?
6. If it's not good enough, go back to step 2 and iterate. You should go through at least 2 visual iterations — don't settle on the first version.
7. For interactive elements (dialogs, forms, dropdowns), write a Playwright script in `e2e/scratch.spec.ts` that opens them and takes screenshots. Run it with `pnpm agent:playwright e2e/scratch.spec.ts`, then view the screenshots.
8. When satisfied, run `pnpm agent:check-ui` to verify no runtime errors on any route.
9. Do a final screenshot of all changed routes and confirm everything looks right.

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
5. Add `@source "../../../packages/domain-NAME/src";` to `apps/web/app/global.css` (Tailwind v4 needs this to scan workspace packages for utility classes)
6. Re-export routes from `apps/web/app/(domains)/NAME/`

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
- **shadcn preset**: `b1D0f1JA` (style: `radix-mira`, icons: `remixicon`). Config in `apps/web/components.json`.
- To add a new shadcn component: `pnpm dlx shadcn@latest add <component> -c apps/web`
- New shadcn components land in `apps/web/app/components/ui/`. Move to `packages/ui/` if shared across domain packages.
- Use `@guild-optimized/ui` for existing base components (Button, Input, Card, etc.)
- Domain components live in `packages/domain-NAME/src/components/`
- Use the `cn()` utility from `@guild-optimized/ui` for className merging
- Icons: `@remixicon/react` (shadcn preset default). Existing `lucide-react` usage is fine.
- Colors: semantic CSS variable tokens (`bg-primary`, `text-muted-foreground`) — never raw color values
- Color tokens and theming are defined in `apps/web/app/global.css` via CSS variables (light + dark mode)
