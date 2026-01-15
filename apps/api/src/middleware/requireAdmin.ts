import type { RequestHandler } from "express"
import jwt from "jsonwebtoken"
import { HttpError } from "../lib/httpError.js"

export type JwtPayload = {
  sub: string
  role: "admin"
}

export const requireAdmin: RequestHandler = (req, _res, next) => {
  const auth = req.header("authorization")
  if (!auth?.startsWith("Bearer ")) {
    throw new HttpError(401, "Missing Authorization header")
  }

  const token = auth.slice("Bearer ".length)
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new HttpError(500, "JWT_SECRET is not configured")
  }

  try {
    const payload = jwt.verify(token, secret) as JwtPayload
    if (payload.role !== "admin") {
      throw new HttpError(403, "Forbidden")
    }

    // attach minimal info for downstream handlers if needed
    ;(req as any).auth = payload
    next()
  } catch (e) {
    throw new HttpError(401, "Invalid token")
  }
}
