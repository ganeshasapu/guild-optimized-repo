import * as React from "react";
import { Loader2, AlertCircle } from "lucide-react";

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
  // Loading state
  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <div className="flex flex-col items-center gap-2 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm font-medium text-destructive">Failed to load tasks</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  // Task list
  return (
    <div className={cn("space-y-4", className)}>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onClick={onTaskClick} />
      ))}
    </div>
  );
}
