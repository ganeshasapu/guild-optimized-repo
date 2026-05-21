"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button, cn } from "@guild-optimized/ui";

import { TaskList } from "./task-list";
import type { Task } from "../types/task.types";
import type { TaskStatus } from "../types/task.types";

type StatusFilter = "all" | TaskStatus;

const filters: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export interface TaskListClientProps {
  tasks: Task[];
  emptyMessage?: string;
  className?: string;
}

export function TaskListClient({ tasks, emptyMessage, className }: TaskListClientProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all");

  const handleTaskClick = (task: Task) => {
    router.push(`/tasks/${task.id}`);
  };

  const filteredTasks = statusFilter === "all"
    ? tasks
    : tasks.filter((t) => t.status === statusFilter);

  return (
    <div className={className}>
      <div className="mb-4 flex gap-1">
        {filters.map((f) => (
          <Button
            key={f.value}
            size="sm"
            variant={statusFilter === f.value ? "secondary" : "ghost"}
            className={cn(
              "text-xs",
              statusFilter === f.value && "font-medium",
            )}
            onClick={() => setStatusFilter(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>
      <TaskList
        tasks={filteredTasks}
        onTaskClick={handleTaskClick}
        emptyMessage={statusFilter === "all" ? emptyMessage : "No tasks match this filter"}
      />
    </div>
  );
}
