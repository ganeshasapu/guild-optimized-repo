import Link from "next/link";
import { CheckSquare, ArrowRight } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@guild-optimized/ui";
import { getAllTasks } from "@guild-optimized/domain-tasks";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch all tasks
  const tasks = await getAllTasks();

  // Count tasks by status
  const todoCount = tasks.filter(task => task.status === "todo").length;
  const inProgressCount = tasks.filter(task => task.status === "in_progress").length;
  const doneCount = tasks.filter(task => task.status === "done").length;

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome to Guild Optimized
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">Task Summary</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Todo</CardTitle>
              <CardDescription>Tasks to be started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{todoCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">In Progress</CardTitle>
              <CardDescription>Currently active tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{inProgressCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Done</CardTitle>
              <CardDescription>Completed tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{doneCount}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/tasks">
          <Card className="transition-colors hover:bg-accent/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                    <CheckSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Tasks</CardTitle>
                    <CardDescription>Manage tasks and track progress</CardDescription>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
