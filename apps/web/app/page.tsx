import { Button } from "@guild-optimized/ui";
import { APP_NAME } from "@guild-optimized/shared";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-24">
      <h1 className="text-4xl font-bold">{APP_NAME}</h1>
      <p className="text-muted-foreground">Guild-optimized starter template</p>
      <Button>Get Started</Button>
    </main>
  );
}
