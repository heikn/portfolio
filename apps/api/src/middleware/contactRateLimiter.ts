import rateLimit from "express-rate-limit"

export const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many messages from this IP. Please try again in 15 minutes.",
  },
})
