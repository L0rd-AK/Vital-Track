import { route, json } from "@/lib/api"
import { UserList } from "@/models"

// Generic per-user string list, e.g. /api/lists/completedExercises or /api/lists/planProgress.
export const GET = route(async ({ uid, params }) => {
  const doc = await UserList.findOne({ uid, key: params.key })
  return json(doc?.items ?? [])
})

export const PUT = route(async ({ uid, req, params }) => {
  const { items } = await req.json()
  if (!Array.isArray(items)) return json({ error: "items must be an array" }, 400)
  const doc = await UserList.findOneAndUpdate(
    { uid, key: params.key },
    { uid, key: params.key, items: items.map(String) },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )
  return json(doc.items)
})
