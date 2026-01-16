import { Router } from "express"

import { contactRateLimiter } from "../middleware/contactRateLimiter.js"
import { validateBody } from "../middleware/validate.js"
import { contactSchema } from "../services/contactSchemas.js"
import { contactController } from "../controllers/contactController.js"
import { asyncHandler } from "../middleware/asyncHandler.js"

export const contactRouter = Router()

contactRouter.post(
	"/",
	contactRateLimiter,
	validateBody(contactSchema),
	asyncHandler(contactController.send)
)
