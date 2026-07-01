import { route, json } from "@/lib/api"
import { PainEntry } from "@/models"

export const GET = route(async ({ uid }) => {
  const items = await PainEntry.find({ uid }).sort({ date: 1 })
  return json(items.map((i) => i.toJSON()))
})

export const POST = route(async ({ uid, req }) => {
  const { date, level, location } = await req.json()
  if (!date || level == null || !location) {
    return json({ error: "date, level and location are required" }, 400)
  }
  const doc = await PainEntry.create({ uid, date, level, location })
  return json(doc.toJSON(), 201)
})
