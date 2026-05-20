# Domain: Tasks

## Purpose

This package implements task management functionality for the Guild-optimized repository. It handles task creation, assignment, status tracking, and collaboration features.

## Structure

- `src/routes/` — Page components for task views
- `src/components/` — Task-specific UI components (task cards, task lists, task forms)
- `src/services/` — Business logic for task operations (CRUD, queries, assignments)
- `src/actions/` — Next.js Server Actions for task mutations
- `src/types/` — TypeScript types for task entities and DTOs
- `src/lib/` — Validation schemas (Zod) and task utilities
- `__tests__/unit/` — Unit tests with mocked database
- `__tests__/integration/` — Integration tests with Neon branch DB
- `__tests__/fixtures/` — Test data for task entities

## Dependencies

- `@guild-optimized/ui` — Base components (Button, Input, Card, Dialog, Select)
- `@guild-optimized/db` — Database access and schema
- `@guild-optimized/shared` — Shared utilities and types
- `zod` — Input validation schemas
- `drizzle-orm` — Type-safe database queries
- `lucide-react` — Icons

## Domain-Specific Conventions

### Task Status Flow

Task statuses follow a specific lifecycle:
- `todo` → `in_progress` → `done`
- `todo` → `cancelled`

Never allow direct transitions that skip intermediate states.

### Server Actions

All task mutations must:
1. Validate input with Zod schemas from `src/lib/`
2. Check permissions (user must own task or be an admin)
3. Return `{ success: true, data }` or `{ success: false, error }`
4. Never throw errors — always return structured results

### Task Components

- Use `@guild-optimized/ui` components for base UI
- Task cards should be keyboard-navigable
- Use semantic colors for task status (`bg-blue-100` for in_progress, `bg-green-100` for done)
- Always show task assignee avatar if present

### Database Queries

- All task queries must include related user data via joins
- Use `getDb()` from `@guild-optimized/db` for database access
- Index queries by `user_id` and `status` for performance
- Pagination: default to 20 tasks per page

### Testing

- Mock `getDb()` in unit tests
- Integration tests must clean up created tasks
- Use fixtures from `__tests__/fixtures/` for test data
- Test all status transitions and permission checks

## File Naming

- Services: `task.service.ts`, `task-assignment.service.ts`
- Actions: `create-task.ts`, `update-task-status.ts`
- Components: `task-card.tsx`, `task-list.tsx`, `task-form.tsx`
- Types: `task.types.ts`
- Schemas: `task.schema.ts`

## Export Pattern

The package exports all public APIs from `src/index.ts`:
```ts
export * from "./routes/page";
export * from "./components/task-card";
export * from "./services/task.service";
export * from "./actions/create-task";
export * from "./types/task.types";
export * from "./lib/task.schema";
```

## Integration with Web App

Routes are re-exported from `apps/web/app/(domains)/tasks/`:
```tsx
export { default } from "@guild-optimized/domain-tasks/routes/page";
```

The web app imports domain components and actions directly:
```tsx
import { TaskCard } from "@guild-optimized/domain-tasks/components/task-card";
import { createTask } from "@guild-optimized/domain-tasks/actions/create-task";
```
