import type { RequestHandler } from "express"
import type { z } from "zod"

export const validateBody = (schema: z.ZodTypeAny): RequestHandler => {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) {
      return next({ name: "ZodError", issues: parsed.error.issues })
    }

    req.body = parsed.data
    next()
  }
}
