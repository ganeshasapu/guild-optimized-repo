import Link from "next/link";
import { headers } from "next/headers";
import { CheckSquare, Circle, Clock, CheckCircle2 } from "lucide-react";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from "@guild-optimized/ui";
import { getTaskStatistics } from "@guild-optimized/domain-tasks";

export default async function Home() {
  await headers();
  
  const stats = await getTaskStatistics();

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome to Guild Optimized
        </p>
      </div>

      {/* Task Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">To Do</CardTitle>
            <Circle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todo}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tasks pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tasks active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Done</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.done}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Tasks completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Empty State or Tasks Link */}
      {stats.total === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CheckSquare className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">No tasks yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first task to get started
              </p>
            </div>
            <Button asChild>
              <Link href="/tasks">Go to Tasks</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="transition-colors hover:bg-accent/50">
          <Link href="/tasks">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                    <CheckSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Tasks</CardTitle>
                    <CardDescription>
                      Manage your {stats.total} {stats.total === 1 ? "task" : "tasks"}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Link>
        </Card>
      )}
    </div>
  );
}
