import type { RequestHandler } from "express"

/**
 * Express 4 doesn't automatically forward errors thrown/rejected from async
 * handlers. Wrap async handlers with this to reliably reach error middleware.
 */
export const asyncHandler = (handler: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}
