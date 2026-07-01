import { route, json } from "@/lib/api"
import { SleepEntry } from "@/models"

export const GET = route(async ({ uid }) => {
  const items = await SleepEntry.find({ uid }).sort({ date: 1 })
  return json(items.map((i) => i.toJSON()))
})

// Upsert by date: one sleep entry per day.
export const POST = route(async ({ uid, req }) => {
  const { date, bedTime, wakeTime, duration, quality } = await req.json()
  if (!date || !bedTime || !wakeTime || duration == null) {
    return json({ error: "date, bedTime, wakeTime and duration are required" }, 400)
  }
  const doc = await SleepEntry.findOneAndUpdate(
    { uid, date },
    { uid, date, bedTime, wakeTime, duration, quality },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )
  return json(doc.toJSON())
})
