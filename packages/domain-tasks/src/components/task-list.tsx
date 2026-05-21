import * as React from "react";
import { Loader2, AlertCircle, Inbox } from "lucide-react";

import { cn } from "@guild-optimized/ui";

import { TaskCard } from "./task-card";
import type { Task } from "../types/task.types";

export interface TaskListProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  isLoading?: boolean;
  error?: string;
  emptyMessage?: string;
  className?: string;
}

export function TaskList({
  tasks,
  onTaskClick,
  isLoading = false,
  error,
  emptyMessage = "No tasks found",
  className,
}: TaskListProps) {
  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-16", className)}>
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex items-center justify-center py-16", className)}>
        <div className="flex flex-col items-center gap-2 text-center">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <p className="text-sm font-medium text-destructive">
            Failed to load tasks
          </p>
          <p className="text-xs text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-16", className)}>
        <Inbox className="mb-3 h-10 w-10 text-muted-foreground/30" />
        <p className="text-sm font-medium text-muted-foreground">No tasks yet</p>
        <p className="mt-1 text-xs text-muted-foreground/70">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border", className)}>
      <div className="divide-y divide-border">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={onTaskClick} />
        ))}
      </div>
    </div>
  );
}
