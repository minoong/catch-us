import { AUTH_PACKAGE } from "@repo/auth";
import { CORE_PACKAGE } from "@repo/core";
import { DB_PACKAGE } from "@repo/db";
import { Button } from "@repo/ui/components/button";

export default function Home() {
  const packages = [AUTH_PACKAGE, CORE_PACKAGE, DB_PACKAGE];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <p className="text-muted-foreground text-sm">{packages.join(" · ")}</p>
      <h1 className="text-4xl font-semibold tracking-tight">Catch Us</h1>
      <Button>사진 서비스 준비 완료</Button>
    </main>
  );
}
