"use client"

import { usePathname } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

// Human-readable titles per route; falls back to a slug-to-title conversion.
const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/pain-tracker": "Pain Tracker",
  "/posture-checker": "Posture Checker",
  "/exercise-reminders": "Exercise Reminders",
  "/exercise-plans": "Exercise Plans",
  "/sleep-tracker": "Sleep Tracker",
  "/sitting-duration": "Sitting Duration",
  "/mood-journal": "Mood Journal",
  "/community": "Community",
  "/doctor-schedule": "Doctor Schedule",
  "/gym-finder": "Gym Finder",
  "/profile": "Profile",
  "/settings": "Settings",
  "/support": "Support",
}

function titleFor(pathname: string) {
  if (titles[pathname]) return titles[pathname]
  const slug = pathname.split("/").filter(Boolean).pop() ?? ""
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

export function AppHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-light-gray bg-white/80 px-4 backdrop-blur-md">
      <SidebarTrigger className="text-rich-navy" />
      <Separator orientation="vertical" className="mr-1 h-6" />
      <h1 className="font-poppins text-lg font-semibold text-rich-navy">{titleFor(pathname)}</h1>
      <span className="ml-auto font-poppins text-sm font-bold text-soft-blue md:hidden">VitalTrack</span>
    </header>
  )
}
