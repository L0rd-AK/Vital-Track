import { route } from "@/lib/api"
import { PainEntry } from "@/models"

export const DELETE = route(async ({ uid, params }) => {
  await PainEntry.deleteOne({ _id: params.id, uid })
  return new Response(null, { status: 204 })
})
