import { route, json } from "@/lib/api"
import { GymReview } from "@/models"

// GET /api/gym-reviews?gymId=xxx — reviews for one gym (or all if omitted).
export const GET = route(async ({ req }) => {
  const gymId = new URL(req.url).searchParams.get("gymId")
  const filter = gymId ? { gymId } : {}
  const items = await GymReview.find(filter).sort({ createdAt: -1 })
  return json(items.map((i) => i.toJSON()))
})

export const POST = route(async ({ uid, req }) => {
  const { gymId, author = "User", rating, comment = "" } = await req.json()
  if (!gymId || rating == null) return json({ error: "gymId and rating are required" }, 400)
  const doc = await GymReview.create({ uid, gymId, author, rating, comment })
  return json(doc.toJSON(), 201)
})
