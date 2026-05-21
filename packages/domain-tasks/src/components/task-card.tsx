"use client";

import * as React from "react";
import { Circle, CircleDot, CheckCircle2 } from "lucide-react";

import { Badge, cn } from "@guild-optimized/ui";

import type { Task } from "../types/task.types";

export interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
  className?: string;
}

const statusConfig = {
  todo: {
    label: "Todo",
    icon: Circle,
    iconClass: "text-muted-foreground",
  },
  in_progress: {
    label: "In Progress",
    icon: CircleDot,
    iconClass: "text-foreground",
  },
  done: {
    label: "Done",
    icon: CheckCircle2,
    iconClass: "text-muted-foreground/50",
  },
};

export function TaskCard({ task, onClick, className }: TaskCardProps) {
  const status = statusConfig[task.status];
  const StatusIcon = status.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-accent/50",
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
      <StatusIcon className={cn("h-4 w-4 shrink-0", status.iconClass)} />

      <span
        className={cn(
          "min-w-0 flex-1 truncate text-sm",
          task.status === "done"
            ? "text-muted-foreground line-through"
            : "text-foreground",
        )}
      >
        {task.title}
      </span>

      <PriorityBadge priority={task.priority} />

      <span className="w-16 shrink-0 text-right text-xs text-muted-foreground">
        {formatRelativeDate(task.createdAt)}
      </span>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: Task["priority"] }) {
  if (priority === "high") {
    return (
      <Badge variant="destructive" className="shrink-0 text-[11px] font-normal">
        Urgent
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="shrink-0 text-[11px] font-normal">
      {priority === "low" ? "Low" : "Medium"}
    </Badge>
  );
}

function formatRelativeDate(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
