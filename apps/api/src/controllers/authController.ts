import jwt from "jsonwebtoken"
import type { RequestHandler } from "express"
import { HttpError } from "../lib/httpError.js"
import bcrypt from "bcryptjs"

const ONE_DAY_SECONDS = 60 * 60 * 24

export const authController = {
  loginAdmin: (async (req, res) => {
    const { email, password } = req.body as { email: string; password: string }

    const adminEmail = process.env.ADMIN_EMAIL
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH
    const jwtSecret = process.env.JWT_SECRET

    if (!adminEmail || !adminPasswordHash) {
      throw new HttpError(500, "ADMIN_EMAIL/ADMIN_PASSWORD_HASH is not configured")
    }
    if (!jwtSecret) {
      throw new HttpError(500, "JWT_SECRET is not configured")
    }

    // Keep it intentionally strict + simple: single admin principal from env.
    const ok = email === adminEmail && bcrypt.compareSync(password, adminPasswordHash)
    if (!ok) {
      throw new HttpError(401, "Invalid email or password")
    }

    const token = jwt.sign(
      { sub: adminEmail, role: "admin" as const },
      jwtSecret,
      { expiresIn: "1d" }
    )

    res.json({
      token,
      token_type: "Bearer",
      expires_in: ONE_DAY_SECONDS,
    })
  }) satisfies RequestHandler,
}
