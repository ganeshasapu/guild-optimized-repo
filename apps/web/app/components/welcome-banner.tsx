"use client";

import { useState } from "react";
import Link from "next/link";
import { RiCloseLine } from "@remixicon/react";

import { Card, CardContent, Button } from "@guild-optimized/ui";

export function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <Card className="mb-8 bg-primary/10">
      <CardContent className="flex items-center justify-between py-4">
        <p className="text-sm">
          Welcome to Guild Optimized! Get started by creating your first task.
        </p>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/tasks">Get Started</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss welcome banner"
          >
            <RiCloseLine className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
