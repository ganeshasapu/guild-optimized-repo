# Design System — Guild Optimized

This document defines the visual language for the application. Read this before building any UI.

## shadcn Preset

- **Preset ID**: `b1D0f1JA`
- **Style**: `radix-mira`
- **Icon library**: `remixicon` (`@remixicon/react`)
- **Config**: `apps/web/components.json`
- **Theme variables**: `apps/web/app/global.css` (`:root` and `.dark` blocks)

To add a new shadcn component:
```bash
pnpm dlx shadcn@latest add <component> -c apps/web
```

Components land in `apps/web/app/components/ui/`. If a component needs to be shared across domain packages, move it to `packages/ui/`.

## Layout

The app uses a **sidebar + main content** shell defined in `apps/web/components/app-shell.tsx`.

```
┌──────────┬──────────────────────────────────────┐
│          │  Header (44px, border-bottom)         │
│ Sidebar  ├──────────────────────────────────────┤
│ (240px)  │                                      │
│          │  Main content (scrollable)            │
│          │                                      │
│          │    ┌─ container mx-auto max-w-4xl ─┐ │
│          │    │  Page header                   │ │
│          │    │  Content                       │ │
│          │    └────────────────────────────────┘ │
└──────────┴──────────────────────────────────────┘
```

- **Sidebar**: 240px, `bg-card`, `border-r`. Hidden on mobile, slides in via hamburger button.
- **Header**: 44px (`page-header` class), `bg-card`, `border-b`. Contains mobile menu toggle.
- **Main**: Fills remaining space, `overflow-y-auto`.

## Adding a New Page

1. Create the page component in `packages/domain-NAME/src/routes/page.tsx`.
2. Re-export from `apps/web/app/(domains)/NAME/page.tsx`:
   ```tsx
   export { default } from "@guild-optimized/domain-NAME/routes/page";
   ```
3. Add a nav entry in `apps/web/components/app-shell.tsx` — add to the `navigation` array:
   ```ts
   { name: "Features", href: "/features", icon: Star },
   ```
4. The page renders inside the app shell automatically.

## Page Structure

Every page should follow this template:

```tsx
export default async function FeaturePage() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      {/* Page header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Page Title</h1>
          <p className="mt-1 text-muted-foreground">
            Short description
          </p>
        </div>
        {/* Primary action button (optional) */}
      </div>

      {/* Page content */}
    </div>
  );
}
```

Key patterns:
- `container mx-auto max-w-4xl py-8` — centers content with consistent padding
- `text-2xl font-bold tracking-tight` — page titles
- `text-muted-foreground` — subtitle/description text
- `mb-8` — spacing between header and content

## Component Usage

Use components from `@guild-optimized/ui`. Never build custom versions of these.

| Pattern | Component | Example |
|---------|-----------|---------|
| Primary action | `<Button>` | Create, Save, Submit |
| Destructive action | `<Button variant="destructive">` | Delete |
| Secondary action | `<Button variant="outline">` | Cancel, Back |
| Data display | `<Card>` with `CardHeader`, `CardContent` | Task card, summary card |
| Status indicator | `<Badge>` | Todo, In Progress, Done |
| Form field | `<Label>` + `<Input>` or `<Textarea>` | Title field, description |
| Selection | `<Select>` with `SelectTrigger`, `SelectContent`, `SelectItem` | Status picker |
| Modal forms | `<Dialog>` with `DialogTrigger`, `DialogContent` | Create/Edit dialogs |
| Confirmation | `<Dialog>` with `DialogFooter` | Delete confirmation |
| Menu | `<DropdownMenu>` | Action overflow menus |
| Visual separator | `<Separator>` | Between sections |

## Color Tokens

All colors are defined as CSS variables in `apps/web/app/global.css` (managed by the shadcn preset). Always use semantic Tailwind classes. Never use raw `oklch()` / hex values.

| Token | Usage |
|-------|-------|
| `bg-background` | App background |
| `bg-card` | Cards, sidebar, elevated surfaces |
| `text-foreground` | Primary text |
| `text-muted-foreground` | Secondary text, labels, descriptions |
| `bg-primary` / `text-primary` | Brand color, primary buttons |
| `bg-secondary` | Subtle backgrounds |
| `bg-accent` / `hover:bg-accent/50` | Hover states on interactive cards |
| `bg-destructive` / `text-destructive` | Errors, delete actions |
| `border` | All borders (cards, dividers, inputs) |
| `bg-sidebar` / `text-sidebar-foreground` | Sidebar-specific tokens |
| `bg-chart-1` through `bg-chart-5` | Chart/data visualization colors |

Dark mode is supported via the `.dark` class on `<html>`. All tokens automatically adapt.

## Spacing

Use Tailwind spacing scale consistently:

- `gap-2` (8px) — between inline elements (icon + text, button groups)
- `gap-4` (16px) — between grid/list items
- `py-8` (32px) — page padding
- `mb-8` (32px) — between page header and content
- `space-y-4` — between stacked cards or list items
- `space-y-2` — between form label and input

## Icons

The shadcn preset uses `@remixicon/react` (Remix Icons). Use these for new components:

```tsx
import { RiAddLine, RiDeleteBinLine, RiArrowLeftLine } from "@remixicon/react";
```

Existing code also uses `lucide-react` — both are fine, but prefer `@remixicon/react` for new work to stay consistent with the preset.

Size: `h-4 w-4` for inline icons, `h-5 w-5` for feature icons.

## Typography

Base font size is 13px (set in `global.css`). Use Tailwind text utilities:

- `text-2xl font-bold tracking-tight` — page titles (h1)
- `text-lg` — card titles
- `text-sm` — body text, labels
- `text-xs` — badges, metadata
- `section-heading` class — uppercase section labels in sidebar/lists

## Server/Client Boundaries

- Page components (`src/routes/`) are **server components** — fetch data with `await`.
- Components with event handlers (`onClick`, `onChange`, `onSubmit`) must have `"use client"`.
- Dialogs, forms, and interactive lists are client components.
- Pass **data** from server to client components, never callbacks.
- Pattern: server page fetches data → passes to client wrapper → client wrapper handles interactivity.

## Custom CSS Classes

Defined in `packages/config-tailwind/preset.ts`:

- `.page-header` — 44px header bar with flex layout and border-bottom
- `.nav-item` — sidebar navigation link with hover/active states
- `.list-row` — standard list row with hover highlight
- `.section-heading` — uppercase tracking-wider section label

## Visual Verification

You must visually verify every UI change. Never ship UI you haven't seen.

**Screenshot a route:**
```bash
pnpm agent:screenshot "/tasks,/tasks/[id]"
# Screenshots saved to e2e/screenshots/ — view with the Read tool
```

**Screenshot interactive states** (dialogs, forms, dropdowns): write a Playwright script in `e2e/scratch.spec.ts`:
```ts
import { test } from "@playwright/test";
import * as fs from "node:fs";
import * as path from "node:path";

const SCREENSHOTS_DIR = path.resolve(__dirname, "screenshots");

test.beforeAll(() => {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
});

test("screenshot the create dialog", async ({ page }) => {
  await page.goto("/tasks", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /new task/i }).click();
  await page.getByRole("heading", { name: /create task/i }).waitFor();
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, "create-dialog.png"),
  });
});
```
Then run:
```bash
pnpm agent:playwright e2e/scratch.spec.ts
```

**Smoke test all routes** (checks for runtime errors, blank pages, console errors):
```bash
pnpm agent:check-ui
```
