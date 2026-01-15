import { Router } from "express"

import { projectsRouter } from "./projects.js"
import { tagsRouter } from "./tags.js"
import { contactRouter } from "./contact.js"
import { imagesRouter } from "./images.js"
import { authRouter } from "./auth.js"

export const router = Router()

router.use("/projects", projectsRouter)
router.use("/tags", tagsRouter)
router.use("/images", imagesRouter)
router.use("/auth", authRouter)
router.use("/contact", contactRouter)
