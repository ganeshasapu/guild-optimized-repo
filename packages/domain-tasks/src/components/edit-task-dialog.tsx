"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@guild-optimized/ui";

import { updateTask } from "../actions/update-task";
import { TaskForm } from "./task-form";
import type { Task } from "../types/task.types";
import type { TaskFormData } from "../types/task.types";

export interface EditTaskDialogProps {
  task: Task;
  children: React.ReactNode;
}

/**
 * Dialog component for editing an existing task
 * Handles form submission with optimistic updates
 */
export function EditTaskDialog({ task, children }: EditTaskDialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (data: TaskFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call server action to update task
      const result = await updateTask(task.id, data);

      if (result.success) {
        // Close dialog on success
        setOpen(false);
        
        // Refresh the page to show the updated task
        // Next.js will revalidate the server component
        router.refresh();
      } else {
        // Show error message
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Make changes to your task. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="rounded-md bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
        
        <TaskForm
          initialData={{
            title: task.title,
            description: task.description ?? "",
            status: task.status,
            priority: task.priority,
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
