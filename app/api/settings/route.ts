import { route, json } from "@/lib/api"
import { Settings } from "@/models"

const defaults = { darkMode: false, notifications: true, sounds: true }

export const GET = route(async ({ uid }) => {
  const doc = await Settings.findOne({ uid })
  return json(doc ? doc.toJSON() : defaults)
})

export const PUT = route(async ({ uid, req }) => {
  const body = await req.json()
  const update: Record<string, unknown> = { uid }
  for (const key of ["darkMode", "notifications", "sounds"] as const) {
    if (key in body) update[key] = Boolean(body[key])
  }
  const doc = await Settings.findOneAndUpdate({ uid }, update, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  })
  return json(doc.toJSON())
})
