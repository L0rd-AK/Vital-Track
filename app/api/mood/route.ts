import { route, json } from "@/lib/api"
import { MoodEntry } from "@/models"

export const GET = route(async ({ uid }) => {
  const items = await MoodEntry.find({ uid }).sort({ date: -1 })
  return json(items.map((i) => i.toJSON()))
})

// Upsert by date: one mood entry per day.
export const POST = route(async ({ uid, req }) => {
  const { date, mood, journal = "" } = await req.json()
  if (!date || !mood) return json({ error: "date and mood are required" }, 400)
  const doc = await MoodEntry.findOneAndUpdate(
    { uid, date },
    { uid, date, mood, journal },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )
  return json(doc.toJSON())
})
