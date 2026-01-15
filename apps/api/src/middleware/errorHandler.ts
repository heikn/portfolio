import type { ErrorRequestHandler } from "express"
import { z } from "zod"
import { HttpError } from "../lib/httpError.js"

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // Normalize Zod errors coming from validateBody()
  if ((err as any)?.name === "ZodError") {
    return res.status(400).json({ error: "ValidationError", details: (err as any).issues })
  }

  // Normalize Zod errors thrown directly by .parse() in controllers
  if (err instanceof z.ZodError) {
    return res.status(400).json({ error: "ValidationError", details: err.issues })
  }

  // eslint-disable-next-line no-console
  console.error(err)

  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, details: err.details })
  }

  return res.status(500).json({ error: "Internal Server Error" })
}
