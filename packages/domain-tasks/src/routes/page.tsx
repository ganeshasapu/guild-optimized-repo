import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@guild-optimized/ui";
import { Badge } from "@guild-optimized/ui";

import { listTasks } from "../services/task-service";
import type { Task } from "../types/index";

function StatusBadge({ status }: { status: Task["status"] }) {
  const variants = {
    todo: "secondary",
    in_progress: "default",
    done: "outline",
  } as const;

  const labels = {
    todo: "To Do",
    in_progress: "In Progress",
    done: "Done",
  };

  return (
    <Badge variant={variants[status]}>{labels[status]}</Badge>
  );
}

export default async function TasksPage() {
  const tasks = await listTasks();

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <span className="text-muted-foreground text-sm">
          {tasks.length} task{tasks.length !== 1 ? "s" : ""}
        </span>
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No tasks yet. Create your first task to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-4">
                  <CardTitle className="text-base font-medium">
                    {task.title}
                  </CardTitle>
                  <StatusBadge status={task.status} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-xs">
                  Created{" "}
                  {new Date(task.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
