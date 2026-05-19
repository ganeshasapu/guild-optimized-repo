# packages/domain-tasks

Domain package for task management.

## Structure
- `src/lib/task.schema.ts` — Zod validation schemas
- `src/services/task.service.ts` — Business logic (listTasks, createTask)
- `src/routes/page.tsx` — Tasks list page component
- `src/types/index.ts` — TypeScript types
- `__tests__/unit/` — Unit tests with mocked DB

## Conventions
- Status values: "todo" | "in_progress" | "done"
- Service functions receive optional `db` parameter for testability
