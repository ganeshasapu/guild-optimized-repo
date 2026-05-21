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
  DialogFooter,
  Button,
} from "@guild-optimized/ui";

import { deleteTask } from "../actions/delete-task";
import type { Task } from "../types/task.types";

export interface DeleteTaskDialogProps {
  task: Task;
  children: React.ReactNode;
  onDeleteSuccess?: () => void;
}

/**
 * Dialog component for confirming task deletion
 * Shows a confirmation dialog before deleting the task
 */
export function DeleteTaskDialog({ task, children, onDeleteSuccess }: DeleteTaskDialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call server action to delete task
      const result = await deleteTask(task.id);

      if (result.success) {
        // Close dialog on success
        setOpen(false);
        
        // Call success callback if provided
        if (onDeleteSuccess) {
          onDeleteSuccess();
        } else {
          // Default behavior: navigate to tasks list
          router.push("/tasks");
          router.refresh();
        }
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{task.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="rounded-md bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
