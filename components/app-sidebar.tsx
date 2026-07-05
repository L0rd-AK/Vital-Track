"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Activity,
  Calendar,
  Clock,
  Dumbbell,
  Home,
  LifeBuoy,
  LogOut,
  MapPin,
  MessageSquare,
  Moon,
  PersonStanding,
  Settings,
  Stethoscope,
  User,
  Users,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"

type NavItem = { title: string; icon: React.ReactNode; href: string }
type NavGroup = { label: string; items: NavItem[] }

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", icon: <Home className="h-4 w-4" />, href: "/dashboard" }],
  },
  {
    label: "Track",
    items: [
      { title: "Pain Tracker", icon: <Activity className="h-4 w-4" />, href: "/pain-tracker" },
      { title: "Sleep Tracker", icon: <Moon className="h-4 w-4" />, href: "/sleep-tracker" },
      { title: "Sitting Duration", icon: <Calendar className="h-4 w-4" />, href: "/sitting-duration" },
      { title: "Mood Journal", icon: <MessageSquare className="h-4 w-4" />, href: "/mood-journal" },
    ],
  },
  {
    label: "Move",
    items: [
      { title: "Posture Checker", icon: <PersonStanding className="h-4 w-4" />, href: "/posture-checker" },
      { title: "Exercise Reminders", icon: <Clock className="h-4 w-4" />, href: "/exercise-reminders" },
      { title: "Exercise Plans", icon: <Dumbbell className="h-4 w-4" />, href: "/exercise-plans" },
    ],
  },
  {
    label: "Connect",
    items: [
      { title: "Community", icon: <Users className="h-4 w-4" />, href: "/community" },
      { title: "Doctor Schedule", icon: <Stethoscope className="h-4 w-4" />, href: "/doctor-schedule" },
      { title: "Gym Finder", icon: <MapPin className="h-4 w-4" />, href: "/gym-finder" },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Profile", icon: <User className="h-4 w-4" />, href: "/profile" },
      { title: "Settings", icon: <Settings className="h-4 w-4" />, href: "/settings" },
      { title: "Support", icon: <LifeBuoy className="h-4 w-4" />, href: "/support" },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { toast } = useToast()
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setUserName(user.name || "User")
      } catch {
        setUserName("User")
      }
    }
  }, [])

  const handleLogout = async () => {
    // Sign out of Firebase first — without this the session stays alive and the
    // login page immediately redirects back to the dashboard.
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Logout error:", error)
    }
    localStorage.removeItem("user")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    window.location.href = "/login"
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-sidebar-accent"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-soft-blue text-white">
            <Activity className="h-5 w-5" />
          </span>
          <span className="font-poppins text-lg font-bold text-soft-blue group-data-[collapsible=icon]:hidden">
            VitalTrack
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                      <Link href={item.href}>
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src="/placeholder.svg" alt={userName} />
              <AvatarFallback className="bg-soft-blue text-white">
                {userName ? userName.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <p className="truncate text-sm font-medium group-data-[collapsible=icon]:hidden">
              {userName || "Guest"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            aria-label="Log out"
            className="group-data-[collapsible=icon]:hidden"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
