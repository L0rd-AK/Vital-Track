"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Search, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Gym {
  id: string
  name: string
  location: string
  distance: string
  rating: number
  services: string[]
  description: string
  image?: string
  reviews?: {
    author: string
    rating: number
    comment: string
  }[]
}

export default function GymFinder() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [reviewGymId, setReviewGymId] = useState<string | null>(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")

  // Sample gyms data
  const gyms: Gym[] = [
    {
      id: "1",
      name: "Fitness Plus",
      location: "123 Main St, Downtown",
      distance: "0.8 miles",
      rating: 4.7,
      services: ["Personal Training", "Physical Therapy", "Pool", "Yoga"],
      description:
        "A full-service gym with specialized back pain management programs and certified trainers experienced in rehabilitation exercises.",
      reviews: [
        {
          author: "Jamie L.",
          rating: 5,
          comment: "Their back pain program is excellent! The trainers are knowledgeable and attentive.",
        },
        { author: "Chris M.", rating: 4, comment: "Great facilities and the physical therapist on staff is amazing." },
      ],
    },
    {
      id: "2",
      name: "Spine & Wellness Center",
      location: "456 Oak Ave, Westside",
      distance: "1.2 miles",
      rating: 4.9,
      services: ["Rehabilitation", "Pilates", "Massage", "Aquatic Therapy"],
      description:
        "Specialized center focusing on spine health with therapeutic equipment and classes designed for those with back issues.",
      reviews: [
        {
          author: "Taylor R.",
          rating: 5,
          comment: "The best place for back pain recovery. Their Pilates classes have transformed my life.",
        },
        {
          author: "Sam K.",
          rating: 5,
          comment: "Incredible staff who really understand back problems. Highly recommend!",
        },
      ],
    },
    {
      id: "3",
      name: "CoreStrength Gym",
      location: "789 Pine Rd, Northside",
      distance: "2.0 miles",
      rating: 4.5,
      services: ["Core Training", "Stretching Classes", "Functional Fitness"],
      description: "Focused on building core strength and proper body mechanics to prevent and alleviate back pain.",
      reviews: [
        {
          author: "Alex W.",
          rating: 4,
          comment: "Their core training program helped reduce my chronic back pain significantly.",
        },
        {
          author: "Jordan T.",
          rating: 5,
          comment: "The stretching classes are perfect for my back issues. Very accommodating staff.",
        },
      ],
    },
    {
      id: "4",
      name: "Gentle Motion Studio",
      location: "321 Elm St, Eastside",
      distance: "1.5 miles",
      rating: 4.8,
      services: ["Yoga", "Tai Chi", "Gentle Movement", "Meditation"],
      description:
        "Low-impact exercise studio specializing in gentle movements that improve flexibility and reduce pain.",
      reviews: [
        {
          author: "Morgan P.",
          rating: 5,
          comment: "The gentle yoga classes are perfect for my sensitive back. Highly recommend!",
        },
        {
          author: "Casey B.",
          rating: 4,
          comment: "Tai Chi has been a game-changer for my back pain. Great instructors.",
        },
      ],
    },
    {
      id: "5",
      name: "Aqua Therapy Center",
      location: "654 River Blvd, Southside",
      distance: "3.2 miles",
      rating: 4.6,
      services: ["Aquatic Exercise", "Hydrotherapy", "Swimming Lessons"],
      description:
        "Water-based exercise facility that offers low-impact workouts ideal for those with back pain or mobility issues.",
      reviews: [
        {
          author: "Riley J.",
          rating: 5,
          comment: "The water exercises have been the only thing that helps my severe back pain.",
        },
        {
          author: "Avery M.",
          rating: 4,
          comment: "Great facilities and knowledgeable instructors for aquatic therapy.",
        },
      ],
    },
    {
      id: "6",
      name: "Back Health Gym",
      location: "987 Cedar Ln, Midtown",
      distance: "1.0 miles",
      rating: 4.8,
      services: ["Specialized Equipment", "Back Classes", "Physical Therapy"],
      description: "Dedicated to back health with specialized equipment and classes designed by physical therapists.",
      reviews: [
        {
          author: "Quinn R.",
          rating: 5,
          comment: "The specialized equipment is perfect for my recovery from back surgery.",
        },
        {
          author: "Dana L.",
          rating: 5,
          comment: "Their back-focused classes have improved my posture and reduced pain.",
        },
      ],
    },
  ]

  // Filter gyms based on search query
  const filteredGyms = gyms.filter((gym) => {
    return (
      gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gym.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gym.services.some((service) => service.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })

  const handleSubmitReview = () => {
    if (!reviewGymId) return

    const gym = gyms.find((g) => g.id === reviewGymId)

    if (!gym) return

    toast({
      title: "Review submitted",
      description: `Thank you for reviewing ${gym.name}!`,
    })

    // Reset form
    setReviewGymId(null)
    setReviewRating(5)
    setReviewComment("")
  }

  const renderRatingStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${index < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"} ${
          interactive ? "cursor-pointer" : ""
        }`}
        onClick={interactive ? () => setReviewRating(index + 1) : undefined}
      />
    ))
  }

  const renderEmoji = (rating: number) => {
    if (rating >= 4.8) return "🤩"
    if (rating >= 4.5) return "😍"
    if (rating >= 4.0) return "😊"
    if (rating >= 3.0) return "🙂"
    return "😐"
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="mb-6 text-3xl font-bold text-rich-navy">Gym Finder & Ratings</h1>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search gyms by name, location, or services"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="list">
        <TabsList className="mb-4 grid w-full grid-cols-2">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          {filteredGyms.map((gym) => (
            <Card key={gym.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      {gym.name} <span className="ml-2 text-xl">{renderEmoji(gym.rating)}</span>
                    </CardTitle>
                    <CardDescription className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3" /> {gym.location} ({gym.distance})
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="flex">
                      {renderRatingStars(gym.rating)}
                      <span className="ml-1 text-sm font-medium">{gym.rating}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm">{gym.description}</p>

                <div className="mb-3 flex flex-wrap gap-2">
                  {gym.services.map((service) => (
                    <Badge key={service} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between">
                  <Button variant="outline">View Details</Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-soft-blue hover:bg-soft-blue/90" onClick={() => setReviewGymId(gym.id)}>
                        Rate & Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Review {gym.name}</DialogTitle>
                        <DialogDescription>
                          Share your experience to help others with back pain find the right gym.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Your Rating</Label>
                          <div className="flex gap-1">{renderRatingStars(reviewRating, true)}</div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="comment">Your Review</Label>
                          <Textarea
                            id="comment"
                            placeholder="Share your experience..."
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button onClick={handleSubmitReview} className="bg-soft-blue hover:bg-soft-blue/90">
                          Submit Review
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {gym.reviews && gym.reviews.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <h3 className="text-sm font-medium">Recent Reviews</h3>
                    {gym.reviews.map((review, index) => (
                      <div key={index} className="rounded-lg border p-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{review.author}</span>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-1 text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {filteredGyms.length === 0 && (
            <div className="mt-8 flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
              <p className="text-center text-muted-foreground">No gyms found matching your criteria</p>
              <Button variant="link" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle>Map View</CardTitle>
              <CardDescription>View gyms in your area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
                <p className="text-center text-muted-foreground">Map view is not available in this demo</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
