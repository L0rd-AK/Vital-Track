"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Bell, Moon, Sun, Volume2 } from "lucide-react"

export default function Settings() {
  const { toast } = useToast()
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [sounds, setSounds] = useState(true)

  const handleToggleDarkMode = (checked: boolean) => {
    setDarkMode(checked)
    toast({
      title: checked ? "Dark mode enabled" : "Light mode enabled",
      description: "Your preference has been saved",
    })
  }

  const handleToggleNotifications = (checked: boolean) => {
    setNotifications(checked)
    toast({
      title: checked ? "Notifications enabled" : "Notifications disabled",
      description: "Your preference has been saved",
    })
  }

  const handleToggleSounds = (checked: boolean) => {
    setSounds(checked)
    toast({
      title: checked ? "Sounds enabled" : "Sounds disabled",
      description: "Your preference has been saved",
    })
  }

  const handleClearData = () => {
    toast({
      title: "Are you sure?",
      description: "This action cannot be undone",
      variant: "destructive",
    })
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="mb-6 font-poppins text-3xl font-bold text-rich-navy">Settings</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {darkMode ? <Moon className="h-5 w-5 text-soft-blue" /> : <Sun className="h-5 w-5 text-soft-yellow" />}
                <Label htmlFor="dark-mode" className="font-medium">
                  Dark Mode
                </Label>
              </div>
              <Switch id="dark-mode" checked={darkMode} onCheckedChange={handleToggleDarkMode} />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-warm-orange" />
                <Label htmlFor="notifications" className="font-medium">
                  Push Notifications
                </Label>
              </div>
              <Switch id="notifications" checked={notifications} onCheckedChange={handleToggleNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Volume2 className="h-5 w-5 text-vibrant-green" />
                <Label htmlFor="sounds" className="font-medium">
                  App Sounds
                </Label>
              </div>
              <Switch id="sounds" checked={sounds} onCheckedChange={handleToggleSounds} />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Manage your app data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border p-4">
              <h3 className="mb-2 font-medium">Clear App Data</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                This will reset all your data including pain entries, exercise plans, and settings.
              </p>
              <Button variant="destructive" onClick={handleClearData}>
                Clear All Data
              </Button>
            </div>

            <div className="rounded-xl border p-4">
              <h3 className="mb-2 font-medium">Export Your Data</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Download all your data in a JSON format for backup or transfer.
              </p>
              <Button variant="outline">Export Data</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
