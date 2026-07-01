"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Check, Shield, Smile, Zap } from "lucide-react"

export default function WelcomePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Welcome to VitalTrack",
      description: "Your personal whole-body wellness companion",
      icon: <Smile className="h-16 w-16 text-soft-blue" />,
      color: "from-soft-blue/20 to-soft-blue/5",
    },
    {
      title: "Track Your Progress",
      description: "Monitor your back health journey with personalized tracking tools",
      icon: <Zap className="h-16 w-16 text-vibrant-green" />,
      color: "from-vibrant-green/20 to-vibrant-green/5",
    },
    {
      title: "Expert Guidance",
      description: "Access professional advice and connect with healthcare providers",
      icon: <Shield className="h-16 w-16 text-warm-orange" />,
      color: "from-warm-orange/20 to-warm-orange/5",
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Final step, navigate to dashboard
      router.push("/dashboard")
    }
  }

  const handleSkip = () => {
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-soft-blue/10 to-gentle-lavender/30">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <div className="font-poppins text-2xl font-bold text-soft-blue">VitalTrack</div>
        <Button variant="ghost" onClick={handleSkip}>
          Skip
        </Button>
      </header>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center p-6">
        <Card className="mx-auto w-full max-w-md overflow-hidden rounded-3xl border-none bg-white shadow-xl">
          <div className={`bg-gradient-to-r ${steps[currentStep].color} p-8 text-center`}>
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-md">
              {steps[currentStep].icon}
            </div>
            <h1 className="mt-6 font-poppins text-3xl font-bold text-rich-navy">{steps[currentStep].title}</h1>
            <p className="mt-2 text-muted-foreground">{steps[currentStep].description}</p>
          </div>

          <div className="p-8">
            {/* Progress indicators */}
            <div className="mb-8 flex justify-center space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === currentStep ? "bg-soft-blue" : "bg-gray-200"
                  } transition-all`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              className="w-full rounded-full bg-soft-blue py-6 text-lg font-semibold hover:bg-soft-blue/90"
            >
              {currentStep < steps.length - 1 ? (
                <>
                  Next <ArrowRight className="ml-2 h-5 w-5" />
                </>
              ) : (
                <>
                  Get Started <Check className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} VitalTrack. All rights reserved.
      </footer>
    </div>
  )
}
