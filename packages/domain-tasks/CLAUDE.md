# domain-tasks

Domain package for task management.

## Structure

- `src/types/` — Re-exports `Task`, `NewTask` from `@guild-optimized/db`
- `src/lib/schemas.ts` — Zod validation schemas (`createTaskSchema`, `updateTaskSchema`)
- `src/services/tasks-service.ts` — All DB queries (getAllTasks, getTaskById, createTask, updateTask, deleteTask)
- `src/actions/` — Next.js Server Actions (one per operation)
- `src/components/` — React components (`TaskList`, `CreateTaskForm`)
- `src/routes/page.tsx` — The main tasks page route

## DB Table

`tasks` table — see `packages/db/src/schema/tasks.ts`

## Usage

```ts
import { getAllTasks, createTask, updateTask, deleteTask } from "@guild-optimized/domain-tasks";
```

## Testing

```bash
pnpm test --filter @guild-optimized/domain-tasks
```
