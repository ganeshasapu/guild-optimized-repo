import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@guild-optimized/ui";

import { listTasks } from "../services/task.service";
import type { TaskStatus } from "../types";

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
};

const STATUS_VARIANTS: Record<
  TaskStatus,
  "default" | "secondary" | "outline"
> = {
  todo: "outline",
  in_progress: "secondary",
  done: "default",
};

export default async function TasksPage() {
  const taskList = await listTasks();

  return (
    <main className="container mx-auto max-w-3xl p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <p className="text-muted-foreground mt-1">
          {taskList.length} task{taskList.length !== 1 ? "s" : ""}
        </p>
      </div>

      {taskList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No tasks yet. Create one to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {taskList.map((task) => (
            <li key={task.id}>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base font-medium">
                      {task.title}
                    </CardTitle>
                    <Badge variant={STATUS_VARIANTS[task.status as TaskStatus]}>
                      {STATUS_LABELS[task.status as TaskStatus] ?? task.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-xs">
                    Created{" "}
                    {new Date(task.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
