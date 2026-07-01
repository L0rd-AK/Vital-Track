"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Clock, Play, Plus, CircleStopIcon as Stop } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface SittingSession {
  id: string
  date: string
  duration: number // in minutes
}

export default function SittingDuration() {
  const { toast } = useToast()
  const [isTracking, setIsTracking] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0) // in seconds
  const [manualHours, setManualHours] = useState(0)
  const [manualMinutes, setManualMinutes] = useState(0)
  const [sittingSessions, setSittingSessions] = useState<SittingSession[]>([])

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isTracking && startTime) {
      interval = setInterval(() => {
        const now = new Date()
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000)
        setElapsedTime(elapsed)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isTracking, startTime])

  useEffect(() => {
    // Load sitting sessions from localStorage or use sample data
    const storedSessions = localStorage.getItem("sittingSessions")
    if (storedSessions) {
      setSittingSessions(JSON.parse(storedSessions))
    } else {
      // Sample data for demonstration
      const today = new Date()
      const sampleData: SittingSession[] = Array.from({ length: 5 }).map((_, index) => {
        const date = new Date(today)
        date.setDate(date.getDate() - index)
        const dateString = date.toISOString().split("T")[0]

        // Random duration between 180-480 minutes (3-8 hours)
        const duration = Math.floor(Math.random() * 300) + 180

        return {
          id: `sample-${index}`,
          date: dateString,
          duration,
        }
      })

      setSittingSessions(sampleData)
      localStorage.setItem("sittingSessions", JSON.stringify(sampleData))
    }
  }, [])

  const startTracking = () => {
    setStartTime(new Date())
    setIsTracking(true)
    setElapsedTime(0)

    toast({
      title: "Tracking started",
      description: "We're now tracking your sitting duration",
    })
  }

  const stopTracking = () => {
    if (!startTime) return

    const now = new Date()
    const durationInMinutes = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60))

    addSittingSession(durationInMinutes)

    setIsTracking(false)
    setStartTime(null)
    setElapsedTime(0)
  }

  const addManualSession = () => {
    const durationInMinutes = manualHours * 60 + manualMinutes

    if (durationInMinutes <= 0) {
      toast({
        title: "Invalid duration",
        description: "Please enter a duration greater than zero",
        variant: "destructive",
      })
      return
    }

    addSittingSession(durationInMinutes)

    // Reset form
    setManualHours(0)
    setManualMinutes(0)
  }

  const addSittingSession = (durationInMinutes: number) => {
    const today = new Date().toISOString().split("T")[0]

    // Check if there's already an entry for today
    const existingSessionIndex = sittingSessions.findIndex((session) => session.date === today)

    let updatedSessions: SittingSession[]

    if (existingSessionIndex >= 0) {
      // Update existing session
      updatedSessions = [...sittingSessions]
      updatedSessions[existingSessionIndex] = {
        ...updatedSessions[existingSessionIndex],
        duration: updatedSessions[existingSessionIndex].duration + durationInMinutes,
      }

      toast({
        title: "Session updated",
        description: `Added ${formatDuration(durationInMinutes)} to today's sitting time`,
      })
    } else {
      // Add new session
      const newSession: SittingSession = {
        id: Date.now().toString(),
        date: today,
        duration: durationInMinutes,
      }

      updatedSessions = [newSession, ...sittingSessions]

      toast({
        title: "Session recorded",
        description: `Recorded ${formatDuration(durationInMinutes)} of sitting time`,
      })
    }

    setSittingSessions(updatedSessions)
    localStorage.setItem("sittingSessions", JSON.stringify(updatedSessions))
  }

  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours === 0) {
      return `${remainingMinutes} min`
    } else if (remainingMinutes === 0) {
      return `${hours} hr`
    } else {
      return `${hours} hr ${remainingMinutes} min`
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  // Calculate today's sitting time
  const today = new Date().toISOString().split("T")[0]
  const todaySession = sittingSessions.find((session) => session.date === today)
  const todaySittingMinutes = todaySession ? todaySession.duration : 0

  // Calculate daily average
  const totalMinutes = sittingSessions.reduce((sum, session) => sum + session.duration, 0)
  const averageMinutes = sittingSessions.length > 0 ? Math.round(totalMinutes / sittingSessions.length) : 0

  // Calculate progress towards daily limit (8 hours = 480 minutes)
  const dailyLimitMinutes = 480
  const progressPercentage = Math.min(100, (todaySittingMinutes / dailyLimitMinutes) * 100)

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="mb-6 text-3xl font-bold text-rich-navy">Sitting Duration Logger</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Track Sitting Time</CardTitle>
            <CardDescription>Monitor how long you sit throughout the day</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isTracking ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-slate-50 p-4 text-center">
                  <p className="text-sm font-medium">Current Session</p>
                  <p className="text-3xl font-bold text-rich-navy">{formatElapsedTime(elapsedTime)}</p>
                </div>

                <Button onClick={stopTracking} variant="destructive" className="w-full">
                  <Stop className="mr-2 h-4 w-4" /> Stop Tracking
                </Button>
              </div>
            ) : (
              <Button onClick={startTracking} className="w-full bg-soft-blue hover:bg-soft-blue/90">
                <Play className="mr-2 h-4 w-4" /> Start Tracking
              </Button>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or add manually</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hours">Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  min="0"
                  max="24"
                  value={manualHours}
                  onChange={(e) => setManualHours(Number.parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minutes">Minutes</Label>
                <Input
                  id="minutes"
                  type="number"
                  min="0"
                  max="59"
                  value={manualMinutes}
                  onChange={(e) => setManualMinutes(Number.parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <Button onClick={addManualSession} variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Manual Entry
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Summary</CardTitle>
            <CardDescription>Your sitting time for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-slate-50 p-4 text-center">
              <p className="text-sm font-medium">Total Sitting Time</p>
              <p className="text-3xl font-bold text-rich-navy">{formatDuration(todaySittingMinutes)}</p>
              <p className="text-xs text-muted-foreground">Daily average: {formatDuration(averageMinutes)}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Daily Limit (8 hours)</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {todaySittingMinutes > dailyLimitMinutes && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Excessive Sitting</AlertTitle>
                <AlertDescription>
                  You've been sitting for more than 8 hours today. Consider taking a break and moving around.
                </AlertDescription>
              </Alert>
            )}

            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-medium">Tips to Reduce Sitting Time</h3>
              <ul className="ml-4 list-disc space-y-1 text-sm">
                <li>Stand up and stretch every 30 minutes</li>
                <li>Take walking meetings when possible</li>
                <li>Use a standing desk for part of your day</li>
                <li>Do simple exercises during breaks</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent History</CardTitle>
            <CardDescription>Your sitting time over the past days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sittingSessions.slice(0, 5).map((session) => (
                <div key={session.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-soft-blue" />
                    <div>
                      <p className="font-medium">{formatDate(session.date)}</p>
                      <p className="text-sm text-muted-foreground">{session.date === today ? "Today" : ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formatDuration(session.duration)}</span>
                    {session.duration > dailyLimitMinutes && <AlertCircle className="h-4 w-4 text-red-500" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
