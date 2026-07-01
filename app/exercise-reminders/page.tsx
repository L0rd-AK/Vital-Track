"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Clock, Plus, Trash2, Bell, Calendar, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Reminder {
  id: string
  time: string
  enabled: boolean
  label: string
  days: string[]
}

export default function ExerciseReminders() {
  const { toast } = useToast()
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [newReminderTime, setNewReminderTime] = useState("08:00")
  const [newReminderLabel, setNewReminderLabel] = useState("Morning Stretch")
  const [selectedDays, setSelectedDays] = useState<string[]>(["mon", "tue", "wed", "thu", "fri"])
  const [completedToday, setCompletedToday] = useState<string[]>([])

  const daysOfWeek = [
    { id: "mon", label: "M" },
    { id: "tue", label: "T" },
    { id: "wed", label: "W" },
    { id: "thu", label: "T" },
    { id: "fri", label: "F" },
    { id: "sat", label: "S" },
    { id: "sun", label: "S" },
  ]

  useEffect(() => {
    // Load reminders from localStorage or use sample data
    const storedReminders = localStorage.getItem("exerciseReminders")
    if (storedReminders) {
      setReminders(JSON.parse(storedReminders))
    } else {
      // Sample data for demonstration
      const sampleReminders: Reminder[] = [
        { id: "1", time: "08:00", enabled: true, label: "Morning Stretch", days: ["mon", "tue", "wed", "thu", "fri"] },
        { id: "2", time: "12:30", enabled: true, label: "Lunch Break Exercise", days: ["mon", "wed", "fri"] },
        { id: "3", time: "17:00", enabled: false, label: "Evening Workout", days: ["tue", "thu"] },
      ]
      setReminders(sampleReminders)
      localStorage.setItem("exerciseReminders", JSON.stringify(sampleReminders))
    }

    // Load completed exercises
    const storedCompleted = localStorage.getItem("completedExercises")
    if (storedCompleted) {
      setCompletedToday(JSON.parse(storedCompleted))
    }
  }, [])

  const saveReminders = (updatedReminders: Reminder[]) => {
    setReminders(updatedReminders)
    localStorage.setItem("exerciseReminders", JSON.stringify(updatedReminders))
  }

  const handleAddReminder = () => {
    if (!newReminderTime) {
      toast({
        title: "Time required",
        description: "Please set a time for your reminder",
        variant: "destructive",
      })
      return
    }

    if (selectedDays.length === 0) {
      toast({
        title: "Days required",
        description: "Please select at least one day for your reminder",
        variant: "destructive",
      })
      return
    }

    const newReminder: Reminder = {
      id: Date.now().toString(),
      time: newReminderTime,
      enabled: true,
      label: newReminderLabel || "Exercise Reminder",
      days: selectedDays,
    }

    const updatedReminders = [...reminders, newReminder]
    saveReminders(updatedReminders)

    toast({
      title: "Reminder added",
      description: `${newReminder.label} at ${formatTime(newReminder.time)}`,
    })

    // Reset form
    setNewReminderTime("08:00")
    setNewReminderLabel("Morning Stretch")
    setSelectedDays(["mon", "tue", "wed", "thu", "fri"])
  }

  const handleToggleReminder = (id: string) => {
    const updatedReminders = reminders.map((reminder) =>
      reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder,
    )
    saveReminders(updatedReminders)

    const reminder = updatedReminders.find((r) => r.id === id)
    if (reminder) {
      toast({
        title: reminder.enabled ? "Reminder enabled" : "Reminder disabled",
        description: `${reminder.label} at ${formatTime(reminder.time)}`,
      })
    }
  }

  const handleDeleteReminder = (id: string) => {
    const reminderToDelete = reminders.find((r) => r.id === id)
    const updatedReminders = reminders.filter((reminder) => reminder.id !== id)
    saveReminders(updatedReminders)

    if (reminderToDelete) {
      toast({
        title: "Reminder deleted",
        description: `${reminderToDelete.label} at ${formatTime(reminderToDelete.time)}`,
      })
    }
  }

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day)
      } else {
        return [...prev, day]
      }
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  const formatDays = (days: string[]) => {
    if (days.length === 7) return "Every day"
    if (
      days.length === 5 &&
      days.includes("mon") &&
      days.includes("tue") &&
      days.includes("wed") &&
      days.includes("thu") &&
      days.includes("fri")
    )
      return "Weekdays"
    if (days.length === 2 && days.includes("sat") && days.includes("sun")) return "Weekends"

    return days.map((day) => day.charAt(0).toUpperCase() + day.slice(1, 3)).join(", ")
  }

  const toggleCompleted = (id: string) => {
    setCompletedToday((prev) => {
      let updated
      if (prev.includes(id)) {
        updated = prev.filter((itemId) => itemId !== id)
      } else {
        updated = [...prev, id]
        toast({
          title: "Exercise completed",
          description: "Great job! Keep up the good work.",
        })
      }
      localStorage.setItem("completedExercises", JSON.stringify(updated))
      return updated
    })
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="mb-6 text-3xl font-bold text-rich-navy">Exercise Reminders</h1>

      <Tabs defaultValue="reminders" className="mb-6">
        <TabsList className="grid w-full grid-cols-2 rounded-full">
          <TabsTrigger value="reminders" className="rounded-full">
            My Reminders
          </TabsTrigger>
          <TabsTrigger value="exercises" className="rounded-full">
            Exercise Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reminders" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="overflow-hidden rounded-2xl border-none shadow-lg bg-gradient-to-br from-[#f6f9fc] to-[#f1f4f9]">
              <CardHeader className="bg-gradient-to-r from-soft-blue/10 to-soft-blue/5 border-b border-soft-blue/10">
                <CardTitle>Add New Reminder</CardTitle>
                <CardDescription>Schedule reminders to stay active throughout the day</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="space-y-2">
                  <Label htmlFor="reminder-time">Reminder Time</Label>
                  <Input
                    id="reminder-time"
                    type="time"
                    value={newReminderTime}
                    onChange={(e) => setNewReminderTime(e.target.value)}
                    className="rounded-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reminder-label">Reminder Label</Label>
                  <Input
                    id="reminder-label"
                    placeholder="e.g., Stretch Break"
                    value={newReminderLabel}
                    onChange={(e) => setNewReminderLabel(e.target.value)}
                    className="rounded-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Repeat on days</Label>
                  <div className="flex justify-between">
                    {daysOfWeek.map((day) => (
                      <Button
                        key={day.id}
                        type="button"
                        variant={selectedDays.includes(day.id) ? "default" : "outline"}
                        className={`h-10 w-10 rounded-full p-0 ${selectedDays.includes(day.id) ? "bg-soft-blue" : ""}`}
                        onClick={() => toggleDay(day.id)}
                      >
                        {day.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button onClick={handleAddReminder} className="w-full bg-soft-blue hover:bg-soft-blue/90 rounded-full">
                  <Plus className="mr-2 h-4 w-4" /> Add Reminder
                </Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-2xl border-none shadow-lg bg-gradient-to-br from-[#f6f9fc] to-[#f1f4f9]">
              <CardHeader className="bg-gradient-to-r from-vibrant-green/10 to-vibrant-green/5 border-b border-vibrant-green/10">
                <CardTitle>Your Reminders</CardTitle>
                <CardDescription>Manage your scheduled exercise reminders</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {reminders.length === 0 ? (
                  <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-center text-muted-foreground">No reminders set. Add your first reminder!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reminders.map((reminder) => (
                      <div
                        key={reminder.id}
                        className="flex items-center justify-between rounded-lg border p-3 bg-white hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`rounded-full p-2 ${reminder.enabled ? "bg-soft-blue/10" : "bg-gray-100"}`}>
                            <Clock className={`h-5 w-5 ${reminder.enabled ? "text-soft-blue" : "text-gray-400"}`} />
                          </div>
                          <div>
                            <p className="font-medium">{reminder.label}</p>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-muted-foreground">{formatTime(reminder.time)}</p>
                              <span className="text-xs text-muted-foreground">•</span>
                              <p className="text-xs text-muted-foreground">{formatDays(reminder.days)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={reminder.enabled ? "default" : "outline"} className="rounded-full">
                            {reminder.enabled ? "Active" : "Inactive"}
                          </Badge>
                          <Switch
                            checked={reminder.enabled}
                            onCheckedChange={() => handleToggleReminder(reminder.id)}
                          />
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteReminder(reminder.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6 overflow-hidden rounded-2xl border-none shadow-lg bg-gradient-to-br from-[#f6f9fc] to-[#f1f4f9]">
            <CardHeader className="bg-gradient-to-r from-gentle-lavender/20 to-gentle-lavender/5 border-b border-gentle-lavender/10">
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Your exercise plan for today</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {reminders
                  .filter((r) => r.enabled)
                  .map((reminder) => (
                    <div key={reminder.id} className="flex items-center justify-between rounded-lg border p-3 bg-white">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-soft-blue/10">
                          <Bell className="h-5 w-5 text-soft-blue" />
                        </div>
                        <div>
                          <p className="font-medium">{reminder.label}</p>
                          <p className="text-sm text-muted-foreground">{formatTime(reminder.time)}</p>
                        </div>
                      </div>
                      <Button
                        variant={completedToday.includes(reminder.id) ? "success" : "outline"}
                        size="sm"
                        className={completedToday.includes(reminder.id) ? "bg-vibrant-green text-white" : ""}
                        onClick={() => toggleCompleted(reminder.id)}
                      >
                        {completedToday.includes(reminder.id) ? (
                          <>
                            <CheckCircle className="mr-1 h-4 w-4" /> Completed
                          </>
                        ) : (
                          "Mark Complete"
                        )}
                      </Button>
                    </div>
                  ))}
                {reminders.filter((r) => r.enabled).length === 0 && (
                  <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-center text-muted-foreground">No active reminders for today</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exercises" className="mt-0">
          <Card className="overflow-hidden rounded-2xl border-none shadow-lg bg-gradient-to-br from-[#f6f9fc] to-[#f1f4f9]">
            <CardHeader className="bg-gradient-to-r from-soft-yellow/20 to-soft-yellow/5 border-b border-soft-yellow/10">
              <CardTitle>Exercise Library</CardTitle>
              <CardDescription>Quick exercises you can do throughout the day</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4 bg-white hover:shadow-md transition-all">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-soft-blue/10">
                    <Calendar className="h-6 w-6 text-soft-blue" />
                  </div>
                  <h3 className="mb-2 font-medium text-rich-navy">Desk Stretches</h3>
                  <ul className="ml-4 list-disc text-sm space-y-1">
                    <li>Neck rolls (10 each direction)</li>
                    <li>Shoulder shrugs (hold 5 seconds)</li>
                    <li>Wrist stretches</li>
                    <li>Seated spinal twist</li>
                  </ul>
                </div>
                <div className="rounded-lg border p-4 bg-white hover:shadow-md transition-all">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-vibrant-green/10">
                    <Calendar className="h-6 w-6 text-vibrant-green" />
                  </div>
                  <h3 className="mb-2 font-medium text-rich-navy">Standing Breaks</h3>
                  <ul className="ml-4 list-disc text-sm space-y-1">
                    <li>Walk for 5 minutes</li>
                    <li>Standing side stretches</li>
                    <li>Calf raises (10 reps)</li>
                    <li>Gentle backbends</li>
                  </ul>
                </div>
                <div className="rounded-lg border p-4 bg-white hover:shadow-md transition-all">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-warm-orange/10">
                    <Calendar className="h-6 w-6 text-warm-orange" />
                  </div>
                  <h3 className="mb-2 font-medium text-rich-navy">Quick Energizers</h3>
                  <ul className="ml-4 list-disc text-sm space-y-1">
                    <li>10 jumping jacks</li>
                    <li>Wall push-ups (5 reps)</li>
                    <li>Seated leg raises</li>
                    <li>Deep breathing (1 minute)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
