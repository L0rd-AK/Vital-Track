"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
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

interface PainEntry {
  date: string
  level: number
  location: string
}

export default function PainTracker() {
  const { toast } = useToast()
  const [painLevel, setPainLevel] = useState(3)
  const [painLocation, setPainLocation] = useState("lower-back")
  const [painEntries, setPainEntries] = useState<PainEntry[]>([])

  useEffect(() => {
    // Load pain entries from localStorage or use sample data
    const storedEntries = localStorage.getItem("painEntries")
    if (storedEntries) {
      setPainEntries(JSON.parse(storedEntries))
    } else {
      // Sample data for demonstration
      const sampleData: PainEntry[] = [
        { date: "2023-04-10", level: 6, location: "lower-back" },
        { date: "2023-04-11", level: 5, location: "lower-back" },
        { date: "2023-04-12", level: 4, location: "neck" },
        { date: "2023-04-13", level: 3, location: "neck" },
        { date: "2023-04-14", level: 4, location: "upper-back" },
        { date: "2023-04-15", level: 2, location: "lower-back" },
        { date: "2023-04-16", level: 3, location: "lower-back" },
      ]
      setPainEntries(sampleData)
      localStorage.setItem("painEntries", JSON.stringify(sampleData))
    }
  }, [])

  const handleAddEntry = () => {
    const today = new Date().toISOString().split("T")[0]
    const newEntry: PainEntry = {
      date: today,
      level: painLevel,
      location: painLocation,
    }

    const updatedEntries = [...painEntries, newEntry]
    setPainEntries(updatedEntries)
    localStorage.setItem("painEntries", JSON.stringify(updatedEntries))

    toast({
      title: "Pain entry recorded",
      description: `Level ${painLevel} pain in ${formatLocation(painLocation)} recorded.`,
    })
  }

  const formatLocation = (location: string) => {
    switch (location) {
      case "lower-back":
        return "Lower Back"
      case "upper-back":
        return "Upper Back"
      case "neck":
        return "Neck"
      case "shoulders":
        return "Shoulders"
      default:
        return location
    }
  }

  // Get color based on pain level
  const getPainLevelColor = (level: number) => {
    if (level <= 3) return "bg-vibrant-green text-white"
    if (level <= 6) return "bg-soft-yellow text-rich-navy"
    return "bg-warm-orange text-white"
  }

  // Prepare chart data
  const chartData = {
    labels: painEntries.slice(-7).map((entry) => {
      const date = new Date(entry.date)
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }),
    datasets: [
      {
        label: "Pain Level",
        data: painEntries.slice(-7).map((entry) => entry.level),
        fill: true,
        backgroundColor: "rgba(255, 99, 71, 0.2)",
        borderColor: "hsl(var(--warm-orange))",
        tension: 0.3,
        borderWidth: 3,
        pointBackgroundColor: "white",
        pointBorderColor: "hsl(var(--warm-orange))",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        title: {
          display: true,
          text: "Pain Level",
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

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="mb-6 font-poppins text-3xl font-bold text-rich-navy">Pain Tracker</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl shadow-md overflow-hidden border-none bg-gradient-to-br from-[#f6f9fc] to-[#f1f4f9]">
          <CardHeader className="bg-gradient-to-r from-soft-blue/10 to-soft-blue/5 border-b border-soft-blue/10">
            <CardTitle>Record Pain</CardTitle>
            <CardDescription>Track your pain level and location</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <Label htmlFor="pain-level">Pain Level (1-10)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  id="pain-level"
                  min={1}
                  max={10}
                  step={1}
                  value={[painLevel]}
                  onValueChange={(value) => setPainLevel(value[0])}
                  className="flex-1"
                />
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${getPainLevelColor(painLevel)} text-center font-bold`}
                >
                  {painLevel}
                </span>
              </div>
              <div className="grid grid-cols-10 text-xs">
                <span className="text-left text-vibrant-green font-medium">Mild</span>
                <span className="col-span-8"></span>
                <span className="text-right text-warm-orange font-medium">Severe</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pain-location">Pain Location</Label>
              <Select value={painLocation} onValueChange={setPainLocation}>
                <SelectTrigger id="pain-location" className="rounded-full">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lower-back">Lower Back</SelectItem>
                  <SelectItem value="upper-back">Upper Back</SelectItem>
                  <SelectItem value="neck">Neck</SelectItem>
                  <SelectItem value="shoulders">Shoulders</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleAddEntry} className="w-full bg-soft-blue hover:bg-soft-blue/90">
              Record Pain
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md overflow-hidden border-none bg-gradient-to-br from-[#f6f9fc] to-[#f1f4f9]">
          <CardHeader className="bg-gradient-to-r from-warm-orange/10 to-warm-orange/5 border-b border-warm-orange/10">
            <CardTitle>Pain History</CardTitle>
            <CardDescription>Your pain levels over time</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64">
              <Line data={chartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 rounded-2xl shadow-md overflow-hidden border-none bg-gradient-to-br from-[#f6f9fc] to-[#f1f4f9]">
          <CardHeader className="bg-gradient-to-r from-vibrant-green/10 to-vibrant-green/5 border-b border-vibrant-green/10">
            <CardTitle>Recent Entries</CardTitle>
            <CardDescription>Your latest pain records</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              {painEntries
                .slice(-5)
                .reverse()
                .map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl border p-3 hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{new Date(entry.date).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">{formatLocation(entry.location)}</p>
                    </div>
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${getPainLevelColor(entry.level)}`}
                    >
                      {entry.level}
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
