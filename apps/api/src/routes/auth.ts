import { Router } from "express"

import { asyncHandler } from "../middleware/asyncHandler.js"
import { validateBody } from "../middleware/validate.js"
import { authController } from "../controllers/authController.js"
import { adminLoginSchema } from "../services/authSchemas.js"

export const authRouter = Router()

// Public (used to obtain an admin token)
authRouter.post("/login", validateBody(adminLoginSchema), asyncHandler(authController.loginAdmin))
