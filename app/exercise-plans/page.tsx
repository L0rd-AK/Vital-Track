"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Clock, Play, Star } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface Exercise {
  id: string
  name: string
  duration: string
  description: string
  image: string
  completed?: boolean
  difficulty: number
}

interface ExercisePlan {
  id: string
  name: string
  level: "beginner" | "intermediate" | "advanced"
  description: string
  exercises: Exercise[]
  color: string
  textColor: string
  accentColor: string
}

export default function ExercisePlans() {
  const { toast } = useToast()

  const [plans, setPlans] = useState<ExercisePlan[]>([
    {
      id: "beginner",
      name: "Gentle Back Relief",
      level: "beginner",
      description: "Simple exercises for beginners to relieve back tension and improve flexibility",
      color: "bg-gradient-to-br from-vibrant-green/20 to-vibrant-green/5",
      textColor: "text-vibrant-green",
      accentColor: "border-vibrant-green/20",
      exercises: [
        {
          id: "b1",
          name: "Cat-Cow Stretch",
          duration: "1 minute",
          description: "Get on all fours and alternate between arching and rounding your back",
          image: "/placeholder.svg?height=150&width=150",
          completed: false,
          difficulty: 1,
        },
        {
          id: "b2",
          name: "Knee-to-Chest Stretch",
          duration: "30 seconds each side",
          description: "Lie on your back and gently pull one knee toward your chest",
          image: "/placeholder.svg?height=150&width=150",
          completed: false,
          difficulty: 1,
        },
        {
          id: "b3",
          name: "Pelvic Tilts",
          duration: "1 minute",
          description: "Lie on your back with knees bent and tilt your pelvis up and down",
          image: "/placeholder.svg?height=150&width=150",
          completed: false,
          difficulty: 2,
        },
        {
          id: "b4",
          name: "Gentle Spinal Twist",
          duration: "30 seconds each side",
          description: "Lie on your back, knees bent, and gently rotate your knees to one side",
          image: "/placeholder.svg?height=150&width=150",
          completed: false,
          difficulty: 2,
        },
      ],
    },
    {
      id: "intermediate",
      name: "Core Strengthening",
      level: "intermediate",
      description: "Moderate exercises to build core strength and support your back",
      color: "bg-gradient-to-br from-soft-blue/20 to-soft-blue/5",
      textColor: "text-soft-blue",
      accentColor: "border-soft-blue/20",
      exercises: [
        {
          id: "i1",
          name: "Bird Dog",
          duration: "10 reps each side",
          description: "On all fours, extend opposite arm and leg while maintaining balance",
          image: "/placeholder.svg?height=150&width=150",
          completed: false,
          difficulty: 3,
        },
        {
          id: "i2",
          name: "Glute Bridges",
          duration: "12 reps",
          description: "Lie on your back, feet flat, and lift your hips toward the ceiling",
          image: "/placeholder.svg?height=150&width=150",
          completed: false,
          difficulty: 2,
        },
        {
          id: "i3",
          name: "Side Plank",
          duration: "20 seconds each side",
          description: "Support your body weight on forearm and side of foot",
          image: "/placeholder.svg?height=150&width=150",
          completed: false,
          difficulty: 4,
        },
        {
          id: "i4",
          name: "Superman",
          duration: "10 reps",
          description: "Lie on your stomach and lift arms and legs off the ground",
          image: "/placeholder.svg?height=150&width=150",
          completed: false,
          difficulty: 3,
        },
        {
          id: "i5",
          name: "Modified Plank",
          duration: "30 seconds",
          description: "Hold a forearm plank position, keeping your core engaged",
          image: "/placeholder.svg?height=150&width=150",
          completed: false,
          difficulty: 3,
        },
      ],
    },
    {
      id: "advanced",
      name: "Back & Core Power",
      level: "advanced",
      description: "Challenging exercises for those with good baseline strength and no acute pain",
      color: "bg-gradient-to-br from-warm-orange/20 to-warm-orange/5",
      textColor: "text-warm-orange",
      accentColor: "border-warm-orange/20",
      exercises: [
        {
          id: "a1",
          name: "Dead Bug",
          duration: "12 reps each side",
          description: "Lie on back, extend opposite arm and leg while keeping core engaged",
          image: "/placeholder.svg?height=150&width=150",
          completed: false,
          difficulty: 4,
        },
        {
          id: "a2",
          name: "Plank with Shoulder Taps",
          duration: "10 taps each side",
          description: "In plank position, tap opposite shoulder while maintaining stability",
          image: "/placeholder.svg?height=150&width=150",
          completed: false,
          difficulty: 4,
        },
        {
          id: "a3",
          name: "Reverse Hyperextension",
          duration: "15 reps",
          description: "Lie on stomach on bench/edge of bed, lift legs with control",
          image: "/placeholder.svg?height=150&width=150",
          completed: false,
          difficulty: 5,
        },
        {
          id: "a4",
          name: "Side Plank with Rotation",
          duration: "8 reps each side",
          description: "From side plank, rotate arm under and back to extended position",
          image: "/placeholder.svg?height=150&width=150",
          completed: false,
          difficulty: 5,
        },
      ],
    },
  ])

  const toggleExerciseCompletion = (planId: string, exerciseId: string) => {
    setPlans((prevPlans) =>
      prevPlans.map((plan) => {
        if (plan.id === planId) {
          return {
            ...plan,
            exercises: plan.exercises.map((exercise) => {
              if (exercise.id === exerciseId) {
                const newCompletedState = !exercise.completed

                // Show toast based on new state
                if (newCompletedState) {
                  toast({
                    title: "Exercise completed!",
                    description: `Great job completing ${exercise.name}`,
                  })
                }

                return {
                  ...exercise,
                  completed: newCompletedState,
                }
              }
              return exercise
            }),
          }
        }
        return plan
      }),
    )
  }

  const calculateProgress = (exercises: Exercise[]) => {
    if (exercises.length === 0) return 0
    const completedCount = exercises.filter((ex) => ex.completed).length
    return Math.round((completedCount / exercises.length) * 100)
  }

  const resetPlanProgress = (planId: string) => {
    setPlans((prevPlans) =>
      prevPlans.map((plan) => {
        if (plan.id === planId) {
          return {
            ...plan,
            exercises: plan.exercises.map((exercise) => ({
              ...exercise,
              completed: false,
            })),
          }
        }
        return plan
      }),
    )

    toast({
      title: "Progress reset",
      description: "All exercises marked as incomplete",
    })
  }

  const renderDifficultyStars = (difficulty: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-3 w-3 ${index < difficulty ? "fill-current text-soft-yellow" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="mb-6 text-3xl font-bold text-rich-navy">Exercise Plans</h1>

      <Tabs defaultValue="beginner">
        <TabsList className="mb-4 grid w-full grid-cols-3 rounded-full">
          <TabsTrigger value="beginner" className="rounded-full">
            Beginner
          </TabsTrigger>
          <TabsTrigger value="intermediate" className="rounded-full">
            Intermediate
          </TabsTrigger>
          <TabsTrigger value="advanced" className="rounded-full">
            Advanced
          </TabsTrigger>
        </TabsList>

        {plans.map((plan) => (
          <TabsContent key={plan.id} value={plan.id}>
            <Card className="overflow-hidden rounded-2xl border-none shadow-lg bg-gradient-to-br from-[#f6f9fc] to-[#f1f4f9]">
              <CardHeader className={`${plan.color} border-b ${plan.accentColor}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className={plan.textColor}>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className={`capitalize ${plan.textColor} border-current`}>
                    {plan.level}
                  </Badge>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{calculateProgress(plan.exercises)}%</span>
                  </div>
                  <Progress
                    value={calculateProgress(plan.exercises)}
                    className={`h-2 ${
                      plan.level === "beginner"
                        ? "[&>div]:bg-vibrant-green"
                        : plan.level === "intermediate"
                        ? "[&>div]:bg-amber-500"
                        : "[&>div]:bg-red-500"
                    }`}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {plan.exercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className={`flex items-start rounded-lg border p-4 transition-all hover:shadow-md ${
                        exercise.completed ? `${plan.color} border-current ${plan.accentColor}` : "bg-white"
                      }`}
                    >
                      <img
                        src={exercise.image || "/placeholder.svg"}
                        alt={exercise.name}
                        className="mr-4 h-16 w-16 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{exercise.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex">{renderDifficultyStars(exercise.difficulty)}</div>
                              <span className="text-xs text-muted-foreground">Difficulty</span>
                            </div>
                          </div>
                          <Button
                            variant={exercise.completed ? "default" : "outline"}
                            size="sm"
                            className={
                              exercise.completed
                                ? `${
                                    plan.level === "beginner"
                                      ? "bg-vibrant-green"
                                      : plan.level === "intermediate"
                                        ? "bg-soft-blue"
                                        : "bg-warm-orange"
                                  }`
                                : ""
                            }
                            onClick={() => toggleExerciseCompletion(plan.id, exercise.id)}
                          >
                            {exercise.completed ? (
                              <>
                                <CheckCircle className="mr-1 h-4 w-4" /> Completed
                              </>
                            ) : (
                              "Mark as Done"
                            )}
                          </Button>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-4 w-4" />
                          <span>{exercise.duration}</span>
                        </div>
                        <p className="mt-2 text-sm">{exercise.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-6 border-t border-gray-100">
                <Button variant="outline" onClick={() => resetPlanProgress(plan.id)} className="rounded-full">
                  Reset Progress
                </Button>
                <Button
                  className={`rounded-full ${
                    plan.level === "beginner"
                      ? "bg-vibrant-green hover:bg-vibrant-green/90"
                      : plan.level === "intermediate"
                        ? "bg-soft-blue hover:bg-soft-blue/90"
                        : "bg-warm-orange hover:bg-warm-orange/90"
                  }`}
                >
                  <Play className="mr-2 h-4 w-4" /> Start Workout
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
