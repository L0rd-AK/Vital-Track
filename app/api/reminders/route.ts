import { route, json } from "@/lib/api"
import { Reminder } from "@/models"

export const GET = route(async ({ uid }) => {
  const items = await Reminder.find({ uid }).sort({ time: 1 })
  return json(items.map((i) => i.toJSON()))
})

export const POST = route(async ({ uid, req }) => {
  const { time, label = "", days = [], enabled = true } = await req.json()
  if (!time) return json({ error: "time is required" }, 400)
  const doc = await Reminder.create({ uid, time, label, days, enabled })
  return json(doc.toJSON(), 201)
})
