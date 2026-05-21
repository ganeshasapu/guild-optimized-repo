"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { TaskList } from "./task-list";
import type { Task } from "../types/task.types";

export interface TaskListClientProps {
  tasks: Task[];
  emptyMessage?: string;
  className?: string;
}

/**
 * Client wrapper for TaskList that adds navigation on click
 */
export function TaskListClient({ tasks, emptyMessage, className }: TaskListClientProps) {
  const router = useRouter();

  const handleTaskClick = (task: Task) => {
    router.push(`/tasks/${task.id}`);
  };

  return (
    <TaskList
      tasks={tasks}
      onTaskClick={handleTaskClick}
      emptyMessage={emptyMessage}
      className={className}
    />
  );
}
