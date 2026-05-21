import * as React from "react";
import { Plus } from "lucide-react";
import { headers } from "next/headers";

import { Button } from "@guild-optimized/ui";

import { getAllTasks } from "../services/task.service";
import { CreateTaskDialog } from "../components/create-task-dialog";
import { TaskListClient } from "../components/task-list-client";

/**
 * Tasks page - displays all tasks with ability to filter and create new tasks
 * Server Component that fetches data on the server
 */
export default async function TasksPage() {
  // Access headers to make this route dynamic
  await headers();
  
  // Fetch all tasks on the server
  const tasks = await getAllTasks();

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your tasks and track your progress
          </p>
        </div>
        <CreateTaskDialog>
          <Button size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        </CreateTaskDialog>
      </div>

      <TaskListClient
        tasks={tasks}
        emptyMessage="No tasks yet. Create one to get started!"
      />
    </div>
  );
}
