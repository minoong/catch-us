import type { CSSProperties, ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@repo/ui/components/sidebar";

import { AppSidebar } from "./app-sidebar";
import { SiteHeader } from "./site-header";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18rem",
          "--header-height": "3rem",
        } as CSSProperties &
          Record<"--sidebar-width" | "--header-height", string>
      }
    >
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
