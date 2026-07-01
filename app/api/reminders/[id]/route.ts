import { route, json } from "@/lib/api"
import { Reminder } from "@/models"

export const PUT = route(async ({ uid, req, params }) => {
  const body = await req.json()
  const allowed = ["time", "label", "days", "enabled"] as const
  const update: Record<string, unknown> = {}
  for (const key of allowed) if (key in body) update[key] = body[key]

  const doc = await Reminder.findOneAndUpdate({ _id: params.id, uid }, update, { new: true })
  if (!doc) return json({ error: "Reminder not found" }, 404)
  return json(doc.toJSON())
})

export const DELETE = route(async ({ uid, params }) => {
  await Reminder.deleteOne({ _id: params.id, uid })
  return new Response(null, { status: 204 })
})
