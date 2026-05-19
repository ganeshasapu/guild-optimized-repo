# domain-tasks

Self-contained feature package for task management.

## Structure
- `src/lib/task-schema.ts` — Zod validation schemas
- `src/services/task-service.ts` — Business logic (listTasks, createTask)
- `src/routes/page.tsx` — Tasks list page (re-exported by apps/web)
- `src/types/index.ts` — TypeScript types
- `__tests__/unit/` — Unit tests with mocked DB

## Key Notes
- DB schema lives in `packages/db/src/schema/tasks.ts`
- Service functions accept an optional `databaseUrl` for Neon branch isolation
- Unit tests mock `@guild-optimized/db` via `vi.mock`
- Status values: `"todo"`, `"in_progress"`, `"done"`
