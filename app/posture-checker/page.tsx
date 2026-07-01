"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Camera, CheckCircle, Info, RefreshCw, Timer } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PostureChecker() {
  const { toast } = useToast()
  const [selectedPosture, setSelectedPosture] = useState<string | null>(null)
  const [remindersEnabled, setRemindersEnabled] = useState(false)
  const [reminderInterval, setReminderInterval] = useState(30) // minutes
  const [feedback, setFeedback] = useState<{
    type: "success" | "warning" | "info" | null
    message: string
  }>({
    type: null,
    message: "",
  })
  const [activeTimer, setActiveTimer] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [goodPostureStreak, setGoodPostureStreak] = useState(0)
  const [activeTab, setActiveTab] = useState("manual")
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraActive, setCameraActive] = useState(false)

  const postures = [
    {
      id: "good-sitting",
      name: "Good Sitting Posture",
      description: "Feet flat on the floor, back straight, shoulders relaxed",
      image: "/placeholder.svg?height=150&width=150",
      isGood: true,
      bgColor: "bg-gradient-to-br from-vibrant-green/20 to-vibrant-green/5",
      borderColor: "border-vibrant-green",
    },
    {
      id: "slouching",
      name: "Slouching",
      description: "Rounded shoulders, curved lower back",
      image: "/placeholder.svg?height=150&width=150",
      isGood: false,
      bgColor: "bg-gradient-to-br from-warm-orange/20 to-warm-orange/5",
      borderColor: "border-warm-orange",
    },
    {
      id: "forward-head",
      name: "Forward Head",
      description: "Head positioned forward, straining neck muscles",
      image: "/placeholder.svg?height=150&width=150",
      isGood: false,
      bgColor: "bg-gradient-to-br from-warm-orange/20 to-warm-orange/5",
      borderColor: "border-warm-orange",
    },
    {
      id: "good-standing",
      name: "Good Standing Posture",
      description: "Weight balanced, shoulders back, chin parallel to floor",
      image: "/placeholder.svg?height=150&width=150",
      isGood: true,
      bgColor: "bg-gradient-to-br from-vibrant-green/20 to-vibrant-green/5",
      borderColor: "border-vibrant-green",
    },
  ]

  const postureTips = [
    "Keep your feet flat on the floor when sitting",
    "Position your computer screen at eye level",
    "Take a break every 30 minutes to stand and stretch",
    "Keep your shoulders relaxed, not hunched or tense",
    "When standing, distribute weight evenly on both feet",
    "Align your ears with your shoulders when sitting",
    "Use a chair with proper lumbar support",
    "Keep your elbows close to your body when typing",
  ]

  useEffect(() => {
    // Reset feedback when posture selection changes
    setFeedback({ type: null, message: "" })
  }, [selectedPosture])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (activeTimer && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            toast({
              title: "Posture Check Reminder",
              description: "Time to check your posture!",
            })
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [activeTimer, timeRemaining, toast])

  const handlePostureCheck = () => {
    if (!selectedPosture) {
      toast({
        title: "No posture selected",
        description: "Please select your current posture first",
        variant: "destructive",
      })
      return
    }

    const selectedPostureObj = postures.find((p) => p.id === selectedPosture)

    if (selectedPostureObj?.isGood) {
      setFeedback({
        type: "success",
        message: "Great job! You're maintaining good posture. Keep it up!",
      })
      setGoodPostureStreak((prev) => prev + 1)
    } else {
      setFeedback({
        type: "warning",
        message: "Your current posture may lead to back pain. Try adjusting to a healthier position.",
      })
      setGoodPostureStreak(0)
    }
  }

  const handleRemindersToggle = (checked: boolean) => {
    setRemindersEnabled(checked)

    if (checked) {
      setTimeRemaining(reminderInterval * 60)
      setActiveTimer(true)
      toast({
        title: "Reminders enabled",
        description: `You'll receive posture check reminders every ${reminderInterval} minutes`,
      })
    } else {
      setActiveTimer(false)
      toast({
        title: "Reminders disabled",
        description: "Posture check reminders turned off",
      })
    }
  }

  const resetTimer = () => {
    setTimeRemaining(reminderInterval * 60)
    setActiveTimer(true)
    toast({
      title: "Timer reset",
      description: `Next reminder in ${reminderInterval} minutes`,
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Get a random posture tip
  const randomTip = postureTips[Math.floor(Math.random() * postureTips.length)]

  const toggleCamera = async () => {
    if (cameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
        videoRef.current.srcObject = null
      }
      setCameraActive(false)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setCameraActive(true)
        toast({
          title: "Camera activated",
          description: "Position yourself to check your posture",
        })
      } catch (err) {
        toast({
          title: "Camera access denied",
          description: "Please allow camera access to use this feature",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="mb-6 text-3xl font-bold text-rich-navy">Posture Checker</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2 rounded-full">
          <TabsTrigger value="manual" className="rounded-full">
            Manual Check
          </TabsTrigger>
          <TabsTrigger value="camera" className="rounded-full">
            Camera Check
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="overflow-hidden rounded-2xl border-none shadow-lg bg-gradient-to-br from-[#f6f9fc] to-[#f1f4f9]">
              <CardHeader className="bg-gradient-to-r from-soft-blue/10 to-soft-blue/5 border-b border-soft-blue/10">
                <CardTitle>Current Posture</CardTitle>
                <CardDescription>Select your current sitting or standing position</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-2 gap-4">
                  {postures.map((posture) => (
                    <div
                      key={posture.id}
                      className={`cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md ${posture.bgColor} ${
                        selectedPosture === posture.id ? `border-2 ${posture.borderColor}` : "border-transparent"
                      }`}
                      onClick={() => setSelectedPosture(posture.id)}
                    >
                      <div className="flex justify-center">
                        <img
                          src={posture.image || "/placeholder.svg"}
                          alt={posture.name}
                          className="mb-2 h-24 w-24 object-cover rounded-lg"
                        />
                      </div>
                      <h3 className="text-center font-medium">{posture.name}</h3>
                      <p className="text-center text-xs text-muted-foreground">{posture.description}</p>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handlePostureCheck}
                  className="w-full bg-soft-blue hover:bg-soft-blue/90"
                  disabled={!selectedPosture}
                >
                  Check My Posture
                </Button>

                {feedback.type && (
                  <Alert variant={feedback.type === "success" ? "default" : "destructive"} className="border-none">
                    {feedback.type === "success" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertTitle>{feedback.type === "success" ? "Good Posture" : "Posture Warning"}</AlertTitle>
                    <AlertDescription>{feedback.message}</AlertDescription>
                  </Alert>
                )}

                {goodPostureStreak > 0 && (
                  <div className="rounded-lg bg-gradient-to-r from-vibrant-green/20 to-vibrant-green/5 p-4 text-center">
                    <p className="font-medium text-vibrant-green">Posture Streak: {goodPostureStreak}</p>
                    <p className="text-sm text-muted-foreground">Keep up the good work!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="overflow-hidden rounded-2xl border-none shadow-lg bg-gradient-to-br from-[#f6f9fc] to-[#f1f4f9]">
              <CardHeader className="bg-gradient-to-r from-vibrant-green/10 to-vibrant-green/5 border-b border-vibrant-green/10">
                <CardTitle>Posture Tips</CardTitle>
                <CardDescription>Helpful advice for maintaining good posture</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <Alert className="border-none bg-gradient-to-r from-gentle-lavender/30 to-gentle-lavender/10">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Daily Tip</AlertTitle>
                  <AlertDescription>{randomTip}</AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <h3 className="font-medium">Common Posture Mistakes:</h3>
                  <ul className="ml-6 list-disc space-y-2">
                    <li>Slouching in your chair</li>
                    <li>Hunching your shoulders forward</li>
                    <li>Cradling your phone between ear and shoulder</li>
                    <li>Keeping your head down while using mobile devices</li>
                    <li>Standing with weight on one leg</li>
                  </ul>
                </div>

                <div className="rounded-lg border p-4 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Timer className="h-5 w-5 text-soft-blue" />
                      <Label htmlFor="posture-reminders" className="font-medium">
                        Posture check reminders
                      </Label>
                    </div>
                    <Switch id="posture-reminders" checked={remindersEnabled} onCheckedChange={handleRemindersToggle} />
                  </div>

                  {remindersEnabled && (
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Next reminder in:</span>
                        <div className="flex items-center">
                          <span className="font-medium text-soft-blue">{formatTime(timeRemaining)}</span>
                          <Button variant="ghost" size="icon" onClick={resetTimer} className="ml-2">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Progress value={(timeRemaining / (reminderInterval * 60)) * 100} className="h-2" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="camera" className="mt-0">
          <Card className="overflow-hidden rounded-2xl border-none shadow-lg bg-gradient-to-br from-[#f6f9fc] to-[#f1f4f9]">
            <CardHeader className="bg-gradient-to-r from-soft-blue/10 to-soft-blue/5 border-b border-soft-blue/10">
              <CardTitle>Camera Posture Check</CardTitle>
              <CardDescription>Use your camera to check your posture in real-time</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="relative aspect-video w-full bg-black/5 rounded-lg overflow-hidden flex items-center justify-center">
                {cameraActive ? (
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-8">
                    <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Camera is currently off</p>
                    <p className="text-xs text-muted-foreground mt-1">Enable camera to check your posture</p>
                  </div>
                )}
              </div>

              <Button
                onClick={toggleCamera}
                className={`w-full ${cameraActive ? "bg-warm-orange hover:bg-warm-orange/90" : "bg-soft-blue hover:bg-soft-blue/90"}`}
              >
                <Camera className="mr-2 h-4 w-4" />
                {cameraActive ? "Turn Off Camera" : "Turn On Camera"}
              </Button>

              {cameraActive && (
                <Alert className="border-none bg-gradient-to-r from-soft-blue/20 to-soft-blue/5">
                  <Info className="h-4 w-4" />
                  <AlertTitle>How to use</AlertTitle>
                  <AlertDescription>
                    Position yourself in front of the camera so your upper body is visible. Make sure you're sitting or
                    standing with proper posture.
                  </AlertDescription>
                </Alert>
              )}

              <div className="rounded-lg border p-4 bg-white">
                <h3 className="font-medium mb-2">Posture Guidelines</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-vibrant-green mr-2 mt-0.5" />
                    <span>Keep your head aligned with your shoulders</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-vibrant-green mr-2 mt-0.5" />
                    <span>Maintain a straight back against your chair</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-vibrant-green mr-2 mt-0.5" />
                    <span>Keep shoulders relaxed and pulled back slightly</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-vibrant-green mr-2 mt-0.5" />
                    <span>Position screen at eye level to avoid neck strain</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
