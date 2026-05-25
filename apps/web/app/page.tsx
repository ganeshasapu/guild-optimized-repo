import Link from "next/link";
import { CheckSquare, ArrowRight } from "lucide-react";
import { RiAddLine } from "@remixicon/react";

import { Button, Card, CardHeader, CardTitle, CardDescription } from "@guild-optimized/ui";

export default function Home() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome to Guild Optimized
          </p>
        </div>
        <Button asChild>
          <Link href="/tasks">
            <RiAddLine className="h-4 w-4" />
            Create Task
          </Link>
        </Button>
      </div>

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
