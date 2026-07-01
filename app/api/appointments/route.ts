import { route, json } from "@/lib/api"
import { Appointment } from "@/models"

export const GET = route(async ({ uid }) => {
  const items = await Appointment.find({ uid }).sort({ date: 1 })
  return json(items.map((i) => i.toJSON()))
})

export const POST = route(async ({ uid, req }) => {
  const { doctorId, doctorName = "", specialty = "", date } = await req.json()
  if (!doctorId || !date) return json({ error: "doctorId and date are required" }, 400)
  const doc = await Appointment.create({ uid, doctorId, doctorName, specialty, date })
  return json(doc.toJSON(), 201)
})
