"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiFetch, ApiError } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Clock, Moon, Sun } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface SleepEntry {
  id?: string
  date: string
  bedTime: string
  wakeTime: string
  duration: number // in hours
  quality?: number // 1-5 scale
}

export default function SleepTracker() {
  const { toast } = useToast()
  const router = useRouter()
  const [bedTime, setBedTime] = useState("22:30")
  const [wakeTime, setWakeTime] = useState("06:30")
  const [sleepDate, setSleepDate] = useState(new Date().toISOString().split("T")[0])
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([])

  useEffect(() => {
    let active = true
    apiFetch<SleepEntry[]>("/api/sleep")
      .then((d) => {
        if (active) setSleepEntries(d)
      })
      .catch((err) => {
        if (!active) return
        if (err instanceof ApiError && err.status === 401) {
          router.push("/login")
          return
        }
        toast({
          title: "Couldn't load sleep data",
          description: err instanceof Error ? err.message : "Please try again.",
          variant: "destructive",
        })
      })
    return () => {
      active = false
    }
  }, [router, toast])

  const calculateSleepDuration = (bedTime: string, wakeTime: string): number => {
    const [bedHours, bedMinutes] = bedTime.split(":").map(Number)
    const [wakeHours, wakeMinutes] = wakeTime.split(":").map(Number)

    let duration = wakeHours - bedHours + (wakeMinutes - bedMinutes) / 60

    // Adjust for overnight sleep
    if (duration < 0) {
      duration += 24
    }

    return Number.parseFloat(duration.toFixed(1))
  }

  const handleAddSleepEntry = async () => {
    const duration = calculateSleepDuration(bedTime, wakeTime)

    const payload: SleepEntry = {
      date: sleepDate,
      bedTime,
      wakeTime,
      duration,
    }

    try {
      const saved = await apiFetch<SleepEntry>("/api/sleep", {
        method: "POST",
        body: JSON.stringify(payload),
      })

      // Merge the saved entry into state: replace an existing entry with the
      // same date, otherwise append; keep the list sorted by date ascending.
      setSleepEntries((prev) => {
        const existingIndex = prev.findIndex((entry) => entry.date === saved.date)
        const merged =
          existingIndex >= 0
            ? prev.map((entry, index) => (index === existingIndex ? saved : entry))
            : [...prev, saved]
        return merged.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      })

      toast({
        title: "Sleep record saved",
        description: `${duration} hours of sleep recorded for ${formatDate(sleepDate)}`,
      })
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.push("/login")
        return
      }
      toast({
        title: "Couldn't save sleep record",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  // Calculate average sleep duration for the last 7 days
  const recentEntries = sleepEntries.slice(-7)
  const averageSleepDuration =
    recentEntries.length > 0 ? recentEntries.reduce((sum, entry) => sum + entry.duration, 0) / recentEntries.length : 0

  // Get sleep quality assessment
  const getSleepQualityText = (hours: number) => {
    if (hours >= 7 && hours <= 9) return { text: "Optimal", color: "text-vibrant-green" }
    if (hours >= 6 && hours < 7) return { text: "Adequate", color: "text-soft-yellow" }
    if (hours > 9) return { text: "Excessive", color: "text-warm-orange" }
    return { text: "Insufficient", color: "text-red-500" }
  }

  // Prepare chart data
  const chartData = {
    labels: recentEntries.map((entry) => formatDate(entry.date)),
    datasets: [
      {
        label: "Sleep Duration (hours)",
        data: recentEntries.map((entry) => entry.duration),
        fill: true,
        backgroundColor: "rgba(99, 179, 237, 0.2)",
        borderColor: "hsl(var(--soft-blue))",
        tension: 0.3,
        borderWidth: 3,
        pointBackgroundColor: "white",
        pointBorderColor: "hsl(var(--soft-blue))",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: false,
        min: 4,
        max: 12,
        title: {
          display: true,
          text: "Hours",
          font: {
            family: "'Roboto', sans-serif",
            size: 14,
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
          font: {
            family: "'Roboto', sans-serif",
            size: 14,
          },
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            family: "'Roboto', sans-serif",
            size: 12,
          },
        },
      },
    },
  }

  const sleepQuality = getSleepQualityText(averageSleepDuration)

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="mb-6 text-3xl font-bold text-rich-navy">Sleep Tracker</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden rounded-2xl border-none shadow-lg bg-gradient-to-br from-[#f6f9fc] to-[#f1f4f9]">
          <CardHeader className="bg-gradient-to-r from-soft-blue/10 to-soft-blue/5 border-b border-soft-blue/10">
            <CardTitle>Record Sleep</CardTitle>
            <CardDescription>Track your sleep schedule and duration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <Label htmlFor="sleep-date">Date</Label>
              <Input
                id="sleep-date"
                type="date"
                value={sleepDate}
                onChange={(e) => setSleepDate(e.target.value)}
                className="rounded-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bed-time" className="flex items-center gap-2">
                  <Moon className="h-4 w-4" /> Bed Time
                </Label>
                <Input
                  id="bed-time"
                  type="time"
                  value={bedTime}
                  onChange={(e) => setBedTime(e.target.value)}
                  className="rounded-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wake-time" className="flex items-center gap-2">
                  <Sun className="h-4 w-4" /> Wake Time
                </Label>
                <Input
                  id="wake-time"
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="rounded-full"
                />
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-medium">Calculated Sleep Duration</p>
              <p className="text-2xl font-bold text-soft-blue">{calculateSleepDuration(bedTime, wakeTime)} hours</p>
            </div>

            <Button onClick={handleAddSleepEntry} className="w-full bg-soft-blue hover:bg-soft-blue/90">
              Save Sleep Record
            </Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-2xl border-none shadow-lg bg-gradient-to-br from-[#f6f9fc] to-[#f1f4f9]">
          <CardHeader className="bg-gradient-to-r from-gentle-lavender/20 to-gentle-lavender/5 border-b border-gentle-lavender/10">
            <CardTitle>Sleep Summary</CardTitle>
            <CardDescription>Your sleep patterns and quality</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Average Sleep Duration</p>
                  <p className="text-2xl font-bold text-soft-blue">{averageSleepDuration.toFixed(1)} hours</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Sleep Quality</p>
                  <p className={`text-lg font-semibold ${sleepQuality.color}`}>{sleepQuality.text}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Recommended (7-9 hours)</span>
                  <span>{Math.min(100, Math.max(0, (averageSleepDuration / 8) * 100)).toFixed(0)}%</span>
                </div>
                <Progress
                  value={Math.min(100, Math.max(0, (averageSleepDuration / 8) * 100))}
                  className="h-2"
                />
              </div>

              {(averageSleepDuration < 6 || averageSleepDuration > 9) && (
                <Alert variant="destructive" className="border-none">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Sleep Warning</AlertTitle>
                  <AlertDescription>
                    {averageSleepDuration < 6
                      ? "You're not getting enough sleep. Aim for 7-9 hours for optimal health."
                      : "You might be oversleeping. Consistent excessive sleep can affect your energy levels."}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="h-64">
              <Line data={chartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 overflow-hidden rounded-2xl border-none shadow-lg bg-gradient-to-br from-[#f6f9fc] to-[#f1f4f9]">
          <CardHeader className="bg-gradient-to-r from-vibrant-green/10 to-vibrant-green/5 border-b border-vibrant-green/10">
            <CardTitle>Recent Sleep Records</CardTitle>
            <CardDescription>Your sleep history for the past week</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              {sleepEntries
                .slice(-7)
                .reverse()
                .map((entry) => (
                  <div
                    key={entry.id ?? entry.date}
                    className="flex items-center justify-between rounded-xl border p-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-soft-blue/10">
                        <Clock className="h-5 w-5 text-soft-blue" />
                      </div>
                      <div>
                        <p className="font-medium">{formatDate(entry.date)}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">
                            {formatTime(entry.bedTime)} - {formatTime(entry.wakeTime)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{entry.duration} hours</p>
                      <p className={`text-xs ${getSleepQualityText(entry.duration).color}`}>
                        {getSleepQualityText(entry.duration).text}
                      </p>
                    </div>
                  </div>
                ))}

              {sleepEntries.length === 0 && (
                <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                  <p className="text-center text-muted-foreground">No sleep records yet. Add your first record!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
