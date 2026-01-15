import type { RequestHandler } from "express"

import { mailService } from "../services/mailService.js"

export const contactController = {
  send: (async (req, res) => {
    // GDPR: do not persist to DB
    await mailService.sendContactMessage(req.body)
    res.status(202).json({ ok: true })
  }) satisfies RequestHandler,
}
