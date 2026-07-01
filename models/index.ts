import mongoose, { Schema, type Model } from "mongoose"

// Strip Mongo internals and never leak uid to the client; expose `id`.
const toJSON = {
  virtuals: true,
  versionKey: false,
  transform: (_doc: unknown, ret: Record<string, unknown>) => {
    delete ret._id
    delete ret.uid
    return ret
  },
}

// Reuse an already-compiled model on hot reload instead of redefining it.
function model<T>(name: string, schema: Schema): Model<T> {
  return (mongoose.models[name] as Model<T>) || mongoose.model<T>(name, schema)
}

const ProfileSchema = new Schema(
  {
    uid: { type: String, required: true, unique: true, index: true },
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    age: { type: String, default: "" },
    gender: { type: String, default: "" },
    painHistory: { type: String, default: "" },
    avatar: { type: String, default: "" },
  },
  { timestamps: true, toJSON }
)

const PainEntrySchema = new Schema(
  {
    uid: { type: String, required: true, index: true },
    date: { type: String, required: true },
    level: { type: Number, required: true },
    location: { type: String, required: true },
  },
  { timestamps: true, toJSON }
)

const ReminderSchema = new Schema(
  {
    uid: { type: String, required: true, index: true },
    time: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    label: { type: String, default: "" },
    days: { type: [String], default: [] },
  },
  { timestamps: true, toJSON }
)

const SleepEntrySchema = new Schema(
  {
    uid: { type: String, required: true, index: true },
    date: { type: String, required: true },
    bedTime: { type: String, required: true },
    wakeTime: { type: String, required: true },
    duration: { type: Number, required: true },
    quality: { type: Number },
  },
  { timestamps: true, toJSON }
)

const SittingSessionSchema = new Schema(
  {
    uid: { type: String, required: true, index: true },
    date: { type: String, required: true },
    duration: { type: Number, required: true },
  },
  { timestamps: true, toJSON }
)

const MoodEntrySchema = new Schema(
  {
    uid: { type: String, required: true, index: true },
    date: { type: String, required: true },
    mood: { type: String, required: true },
    journal: { type: String, default: "" },
  },
  { timestamps: true, toJSON }
)

const CommunityPostSchema = new Schema(
  {
    uid: { type: String, required: true, index: true },
    author: {
      name: { type: String, default: "User" },
      avatar: { type: String, default: "" },
    },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    likedBy: { type: [String], default: [] },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
)

const AppointmentSchema = new Schema(
  {
    uid: { type: String, required: true, index: true },
    doctorId: { type: String, required: true },
    doctorName: { type: String, default: "" },
    specialty: { type: String, default: "" },
    date: { type: String, required: true },
  },
  { timestamps: true, toJSON }
)

const GymReviewSchema = new Schema(
  {
    uid: { type: String, required: true, index: true },
    gymId: { type: String, required: true, index: true },
    author: { type: String, default: "User" },
    rating: { type: Number, required: true },
    comment: { type: String, default: "" },
  },
  { timestamps: true, toJSON }
)

const SettingsSchema = new Schema(
  {
    uid: { type: String, required: true, unique: true, index: true },
    darkMode: { type: Boolean, default: false },
    notifications: { type: Boolean, default: true },
    sounds: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON }
)

// Generic per-user string list (e.g. completed reminders, plan progress),
// keyed by (uid, key) so one model backs several simple checklists.
const UserListSchema = new Schema({
  uid: { type: String, required: true, index: true },
  key: { type: String, required: true },
  items: { type: [String], default: [] },
})
UserListSchema.index({ uid: 1, key: 1 }, { unique: true })

export const Profile = model("Profile", ProfileSchema)
export const PainEntry = model("PainEntry", PainEntrySchema)
export const Reminder = model("Reminder", ReminderSchema)
export const SleepEntry = model("SleepEntry", SleepEntrySchema)
export const SittingSession = model("SittingSession", SittingSessionSchema)
export const MoodEntry = model("MoodEntry", MoodEntrySchema)
export const CommunityPost = model("CommunityPost", CommunityPostSchema)
export const Appointment = model("Appointment", AppointmentSchema)
export const GymReview = model("GymReview", GymReviewSchema)
export const Settings = model("Settings", SettingsSchema)
export const UserList = model("UserList", UserListSchema)
