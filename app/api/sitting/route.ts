import { route, json } from "@/lib/api"
import { SittingSession } from "@/models"

export const GET = route(async ({ uid }) => {
  const items = await SittingSession.find({ uid }).sort({ date: 1 })
  return json(items.map((i) => i.toJSON()))
})

// Accumulate minutes into the existing session for that date, or create one.
export const POST = route(async ({ uid, req }) => {
  const { date, duration } = await req.json()
  if (!date || duration == null) {
    return json({ error: "date and duration are required" }, 400)
  }
  const doc = await SittingSession.findOneAndUpdate(
    { uid, date },
    { $inc: { duration }, $setOnInsert: { uid, date } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )
  return json(doc.toJSON())
})
