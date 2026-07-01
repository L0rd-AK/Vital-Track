"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Activity, Calendar, Clock, Heart, MapPin, MessageSquare, Moon, User, Users, Zap } from "lucide-react"
import Link from "next/link"

interface DashboardUser {
  name: string
  email: string
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")

    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(storedUser))
  }, [router])

  if (!user) return null

  const quickStats = [
    { label: "Streak", value: "5 days" },
    { label: "Exercise Minutes", value: "120 min" },
    { label: "Pain Level", value: "Low" },
    { label: "Posture Score", value: "8.5/10" },
  ]

  const features = [
    {
      title: "Pain Tracker",
      description: "Record and monitor your back pain",
      icon: <Activity className="h-8 w-8 text-white" />,
      href: "/pain-tracker",
      bgColor: "bg-gradient-to-br from-warm-orange to-warm-orange/70",
      textColor: "text-white",
    },
    {
      title: "Posture Checker",
      description: "Improve your sitting and standing posture",
      icon: <User className="h-8 w-8 text-white" />,
      href: "/posture-checker",
      bgColor: "bg-gradient-to-br from-soft-blue to-soft-blue/70",
      textColor: "text-white",
    },
    {
      title: "Exercise Reminders",
      description: "Set reminders to stay active",
      icon: <Clock className="h-8 w-8 text-white" />,
      href: "/exercise-reminders",
      bgColor: "bg-gradient-to-br from-vibrant-green to-vibrant-green/70",
      textColor: "text-white",
    },
    {
      title: "Exercise Plans",
      description: "Follow structured exercise routines",
      icon: <Zap className="h-8 w-8 text-rich-navy" />,
      href: "/exercise-plans",
      bgColor: "bg-gradient-to-br from-soft-yellow to-soft-yellow/70",
      textColor: "text-rich-navy",
    },
    {
      title: "Sleep Tracker",
      description: "Monitor your sleep patterns",
      icon: <Moon className="h-8 w-8 text-white" />,
      href: "/sleep-tracker",
      bgColor: "bg-gradient-to-br from-[#9b7ede] to-gentle-lavender",
      textColor: "text-white",
    },
    {
      title: "Sitting Duration",
      description: "Track how long you sit daily",
      icon: <Calendar className="h-8 w-8 text-white" />,
      href: "/sitting-duration",
      bgColor: "bg-gradient-to-br from-[#ff7e5f] to-[#feb47b]",
      textColor: "text-white",
    },
    {
      title: "User Profile",
      description: "Manage your personal information",
      icon: <User className="h-8 w-8 text-white" />,
      href: "/profile",
      bgColor: "bg-gradient-to-br from-[#4facfe] to-[#00f2fe]",
      textColor: "text-white",
    },
    {
      title: "Community Support",
      description: "Connect with others for motivation",
      icon: <Users className="h-8 w-8 text-white" />,
      href: "/community",
      bgColor: "bg-gradient-to-br from-[#43e97b] to-[#38f9d7]",
      textColor: "text-white",
    },
    {
      title: "Doctor Schedule",
      description: "Find and book doctor appointments",
      icon: <Heart className="h-8 w-8 text-white" />,
      href: "/doctor-schedule",
      bgColor: "bg-gradient-to-br from-[#fa709a] to-[#fee140]",
      textColor: "text-white",
    },
    {
      title: "Gym Finder",
      description: "Discover and rate local fitness centers",
      icon: <MapPin className="h-8 w-8 text-white" />,
      href: "/gym-finder",
      bgColor: "bg-gradient-to-br from-[#0ba360] to-[#3cba92]",
      textColor: "text-white",
    },
    {
      title: "Mood Journal",
      description: "Track your emotional wellbeing",
      icon: <MessageSquare className="h-8 w-8 text-white" />,
      href: "/mood-journal",
      bgColor: "bg-gradient-to-br from-[#6a11cb] to-[#2575fc]",
      textColor: "text-white",
    },
  ]

  return (
    <div className="container mx-auto p-4 md:p-6">
      <header className="mb-8">
        <h1 className="font-poppins text-3xl font-bold text-rich-navy">
          {greeting}, {user.name}
        </h1>
        <p className="text-muted-foreground">Your whole-body wellness companion</p>
      </header>

      {/* Quick Stats Section */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {quickStats.map((stat) => (
          <Card key={stat.label} className="bg-white p-4 shadow-sm">
            <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
            <p className="mt-1 text-2xl font-bold text-rich-navy">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.title}>
            <Card
              className={`group h-full ${feature.bgColor} backdrop-blur-sm border-none rounded-2xl overflow-hidden 
              transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
            >
              <div className="relative p-6">
                <div className="absolute top-0 left-0 h-full w-full bg-white/5 backdrop-blur-[2px] opacity-0 
                  group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="mb-6 inline-flex">
                    <div className="rounded-xl bg-white/20 p-3.5 backdrop-blur-md 
                      shadow-inner transition-transform duration-300 group-hover:scale-110">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className={`text-xl font-poppins font-semibold tracking-tight ${feature.textColor}`}>
                      {feature.title}
                    </h3>
                    <p className={`${feature.textColor} opacity-90 font-light leading-relaxed`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
