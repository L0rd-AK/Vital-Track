"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiFetch, ApiError } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save } from "lucide-react"

interface UserProfile {
  name: string
  email: string
  age: string
  gender: string
  painHistory: string
  avatar?: string
}

export default function Profile() {
  const { toast } = useToast()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    age: "",
    gender: "",
    painHistory: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let active = true

    apiFetch<UserProfile>("/api/profile")
      .then((data) => {
        if (!active) return

        let { name, email } = data

        // Prefill name/email from the login "user" only when the fetched profile is missing them.
        if (!name || !email) {
          const storedUser = localStorage.getItem("user")
          if (storedUser) {
            const user = JSON.parse(storedUser) as { name?: string; email?: string }
            if (!name) name = user.name || ""
            if (!email) email = user.email || ""
          }
        }

        setProfile({
          name,
          email,
          age: data.age,
          gender: data.gender,
          painHistory: data.painHistory,
          avatar: data.avatar,
        })
      })
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 401) {
          router.push("/login")
          return
        }
        toast({
          title: "Couldn't load profile",
          description: err instanceof Error ? err.message : "Something went wrong",
          variant: "destructive",
        })
      })

    return () => {
      active = false
    }
  }, [router, toast])

  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)

    try {
      const saved = await apiFetch<UserProfile>("/api/profile", {
        method: "PUT",
        body: JSON.stringify(profile),
      })

      setProfile(saved)

      // Keep the login "user" in sync so the sidebar/greeting stay up to date.
      const userData = { name: saved.name, email: saved.email }
      localStorage.setItem("user", JSON.stringify(userData))

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      })
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 401) {
        router.push("/login")
        return
      }
      toast({
        title: "Couldn't save profile",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="mb-6 text-3xl font-bold text-rich-navy">User Profile</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Manage your profile image</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
              <AvatarFallback className="text-4xl">{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <Button variant="outline" className="w-full">
              <Camera className="mr-2 h-4 w-4" /> Change Picture
            </Button>

            <div className="w-full rounded-lg border p-4">
              <h3 className="mb-2 font-medium">Account Info</h3>
              <div className="space-y-1 text-sm">
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Member since:</span>
                  <span>April 2023</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Last login:</span>
                  <span>Today</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={profile.name} onChange={(e) => handleChange("name", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={profile.age}
                  onChange={(e) => handleChange("age", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={profile.gender} onValueChange={(value) => handleChange("gender", value)}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pain-history">Pain History</Label>
              <Textarea
                id="pain-history"
                placeholder="Describe your back pain history..."
                rows={4}
                value={profile.painHistory}
                onChange={(e) => handleChange("painHistory", e.target.value)}
              />
            </div>

            <Button onClick={handleSaveProfile} className="w-full bg-soft-blue hover:bg-soft-blue/90" disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Saving..." : "Save Profile"}
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
            <CardDescription>Manage how your information is used</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h3 className="font-medium">Share progress with healthcare providers</h3>
                  <p className="text-sm text-muted-foreground">Allow your doctors to view your pain tracking data</p>
                </div>
                <Button variant="outline">Manage</Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h3 className="font-medium">Community visibility</h3>
                  <p className="text-sm text-muted-foreground">Control what information is visible to the community</p>
                </div>
                <Button variant="outline">Manage</Button>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <h3 className="font-medium">Data usage & analytics</h3>
                  <p className="text-sm text-muted-foreground">Manage how your data is used to improve the app</p>
                </div>
                <Button variant="outline">Manage</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
