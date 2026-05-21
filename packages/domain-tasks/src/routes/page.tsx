import * as React from "react";
import { headers } from "next/headers";

import { Button } from "@guild-optimized/ui";

import { getAllTasks } from "../services/task.service";
import { CreateTaskDialog } from "../components/create-task-dialog";
import { TaskListClient } from "../components/task-list-client";

export default async function TasksPage() {
  await headers();

  const tasks = await getAllTasks();

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="mt-1 text-muted-foreground">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </p>
        </div>
        <CreateTaskDialog>
          <Button size="sm">New Task</Button>
        </CreateTaskDialog>
      </div>

      <TaskListClient
        tasks={tasks}
        emptyMessage="Create one to get started!"
      />
    </div>
  );
}
