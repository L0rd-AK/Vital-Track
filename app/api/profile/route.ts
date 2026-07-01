import { route, json } from "@/lib/api"
import { Profile } from "@/models"

const empty = { name: "", email: "", age: "", gender: "", painHistory: "", avatar: "" }

export const GET = route(async ({ uid }) => {
  const doc = await Profile.findOne({ uid })
  return json(doc ? doc.toJSON() : empty)
})

export const PUT = route(async ({ uid, req }) => {
  const body = await req.json()
  const update = {
    uid,
    name: body?.name ?? "",
    email: body?.email ?? "",
    age: body?.age ?? "",
    gender: body?.gender ?? "",
    painHistory: body?.painHistory ?? "",
    avatar: body?.avatar ?? "",
  }
  const doc = await Profile.findOneAndUpdate({ uid }, update, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  })
  return json(doc.toJSON())
})
