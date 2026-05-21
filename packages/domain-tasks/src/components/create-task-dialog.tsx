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

import { createTask } from "../actions/create-task";
import { TaskForm } from "./task-form";
import type { TaskFormData } from "../types/task.types";

export interface CreateTaskDialogProps {
  children: React.ReactNode;
}

/**
 * Dialog component for creating a new task
 * Handles form submission with optimistic updates
 */
export function CreateTaskDialog({ children }: CreateTaskDialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (data: TaskFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Call server action to create task
      const result = await createTask(data);

      if (result.success) {
        // Close dialog on success
        setOpen(false);
        
        // Refresh the page to show the new task
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
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Add a new task to your list. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="rounded-md bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
        
        <TaskForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}