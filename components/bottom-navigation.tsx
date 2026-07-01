"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, User, Settings, LifeBuoy } from "lucide-react"

export function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Home",
      href: "/dashboard",
      icon: <Home className="h-6 w-6" />,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: <User className="h-6 w-6" />,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings className="h-6 w-6" />,
    },
    {
      name: "Support",
      href: "/support",
      icon: <LifeBuoy className="h-6 w-6" />,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-200 bg-white md:hidden">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center px-3 py-2 ${
                isActive ? "text-soft-blue" : "text-gray-500 hover:text-soft-blue"
              }`}
            >
              {item.icon}
              <span className="text-xs">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
