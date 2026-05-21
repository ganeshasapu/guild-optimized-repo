import * as React from "react";
import { AlertCircle, Clock, CheckCircle2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  cn,
} from "@guild-optimized/ui";

import type { Task } from "../types/task.types";

export interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
  className?: string;
}

const statusConfig = {
  todo: {
    label: "To Do",
    variant: "secondary" as const,
    icon: Clock,
  },
  in_progress: {
    label: "In Progress",
    variant: "default" as const,
    icon: AlertCircle,
  },
  done: {
    label: "Done",
    variant: "outline" as const,
    icon: CheckCircle2,
  },
};

const priorityConfig = {
  low: {
    label: "Low",
    color: "text-muted-foreground",
  },
  medium: {
    label: "Medium",
    color: "text-foreground",
  },
  high: {
    label: "High",
    color: "text-destructive",
  },
};

export function TaskCard({ task, onClick, className }: TaskCardProps) {
  const statusInfo = statusConfig[task.status];
  const priorityInfo = priorityConfig[task.priority];
  const StatusIcon = statusInfo.icon;

  return (
    <Card
      className={cn(
        "transition-colors hover:bg-accent/50 cursor-pointer",
        className,
      )}
      onClick={() => onClick?.(task)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(task);
        }
      }}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <Badge variant={statusInfo.variant} className="shrink-0">
            <StatusIcon className="mr-1 h-3 w-3" />
            {statusInfo.label}
          </Badge>
        </div>
        {task.description && (
          <CardDescription className="line-clamp-2">
            {task.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Priority:</span>
            <span className={cn("font-medium", priorityInfo.color)}>
              {priorityInfo.label}
            </span>
          </div>
          <time className="text-muted-foreground">
            {new Date(task.createdAt).toLocaleDateString()}
          </time>
        </div>
      </CardContent>
    </Card>
  );
}
