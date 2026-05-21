import * as React from "react";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@guild-optimized/ui";

import { getTaskById } from "../../services/task.service";
import { TaskCard } from "../../components/task-card";
import { EditTaskDialog } from "../../components/edit-task-dialog";
import { DeleteTaskDialog } from "../../components/delete-task-dialog";

export interface TaskDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Task detail page - displays a single task with edit and delete functionality
 * Server Component that fetches data on the server
 */
export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  // Access headers to make this route dynamic
  await headers();
  
  // Await params to get the ID
  const { id } = await params;
  
  // Fetch the task by ID
  const task = await getTaskById(id);

  // Show 404 if task not found
  if (!task) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link href="/tasks">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tasks
          </Button>
        </Link>
      </div>

      {/* Page header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Details</h1>
          <p className="mt-2 text-muted-foreground">
            View and manage your task
          </p>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2">
          <EditTaskDialog task={task}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </EditTaskDialog>
          
          <DeleteTaskDialog task={task}>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DeleteTaskDialog>
        </div>
      </div>

      {/* Task details */}
      <TaskCard task={task} />
    </div>
  );
}
