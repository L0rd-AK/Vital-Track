import { connectToDatabase } from "./mongodb"
import { AuthError, requireUid } from "./auth-server"

type RouteContext = { params?: Promise<Record<string, string>> }
type Handler = (ctx: {
  uid: string
  req: Request
  params: Record<string, string>
}) => Promise<Response> | Response

// Wraps a route handler: connects to Mongo, verifies the Firebase token,
// resolves async route params, and normalizes error responses.
export function route(handler: Handler) {
  return async (req: Request, context: RouteContext = {}) => {
    try {
      await connectToDatabase()
      const uid = await requireUid(req)
      const params = context.params ? await context.params : {}
      return await handler({ uid, req, params })
    } catch (err) {
      const status = err instanceof AuthError ? err.status : 500
      const message = err instanceof Error ? err.message : "Internal error"
      if (status === 500) console.error("API error:", err)
      return Response.json({ error: message }, { status })
    }
  }
}

export function json(data: unknown, status = 200) {
  return Response.json(data, { status })
}
