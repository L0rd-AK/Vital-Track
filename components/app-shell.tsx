"use client"

import { usePathname } from "next/navigation"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { BottomNavigation } from "@/components/bottom-navigation"

// Auth / onboarding routes render full-screen without the app chrome.
const bareRoutes = ["/", "/login", "/welcome"]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (bareRoutes.includes(pathname)) {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 overflow-auto bg-calming-white pb-16 md:pb-0">{children}</main>
        <BottomNavigation />
      </SidebarInset>
    </SidebarProvider>
  )
}
