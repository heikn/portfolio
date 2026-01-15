import { Router } from "express"

import { requireAdmin } from "../middleware/requireAdmin.js"
import { tagsController } from "../controllers/tagsController.js"
import { validateBody } from "../middleware/validate.js"
import { tagCreateSchema } from "../services/tagsSchemas.js"
import { asyncHandler } from "../middleware/asyncHandler.js"

export const tagsRouter = Router()

// Public
tagsRouter.get("/", asyncHandler(tagsController.list))

// Admin
tagsRouter.post("/", requireAdmin, validateBody(tagCreateSchema), asyncHandler(tagsController.create))
tagsRouter.delete("/:id", requireAdmin, asyncHandler(tagsController.remove))
