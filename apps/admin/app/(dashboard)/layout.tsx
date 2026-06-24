import type { ReactNode } from "react";

import { AdminShell } from "@/widgets/admin-shell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
