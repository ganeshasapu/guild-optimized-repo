import Link from "next/link";

import { Button } from "@guild-optimized/ui";

export default function TaskNotFound() {
  return (
    <div className="container mx-auto max-w-4xl py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Task Not Found</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The task you're looking for doesn't exist or has been deleted.
        </p>
        <div className="mt-8">
          <Link href="/tasks">
            <Button>Back to Tasks</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
