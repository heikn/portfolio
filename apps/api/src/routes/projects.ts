import { Router } from "express"
import { requireAdmin } from "../middleware/requireAdmin.js"
import { projectsController } from "../controllers/projectsController.js"
import { validateBody } from "../middleware/validate.js"
import { projectCreateSchema, projectUpdateSchema } from "../services/projectsSchemas.js"
import { asyncHandler } from "../middleware/asyncHandler.js"
import { z } from "zod"
import multer from "multer"
import path from "node:path"
import crypto from "node:crypto"
import { imagesController } from "../controllers/imagesController.js"
import { fileURLToPath } from "node:url"

export const projectsRouter = Router()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.resolve(__dirname, "..", "..", "uploads")

const tagIdsSchema = z.object({
  tag_ids: z.array(z.string().uuid()).default([]),
})

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname)
      cb(null, `${crypto.randomUUID()}${ext}`)
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
})

const attachImageSchema = z.object({
  image_id: z.string().uuid(),
  type: z.enum(["hero", "gallery", "thumbnail"]),
  alt_text: z.string().min(1).nullable().optional(),
  order_index: z.number().int().optional(),
})

const reorderProjectImagesSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid(),
      order_index: z.number().int(),
    })
  ),
})

const createProjectImageByUrlSchema = z.object({
  url: z.string().url(),
  alt_text: z.string().min(1).nullable().optional(),
  type: z.enum(["hero", "gallery", "thumbnail"]),
  order_index: z.number().int().optional(),
})


// Public
projectsRouter.get("/", asyncHandler(projectsController.list))
projectsRouter.get("/:slug", asyncHandler(projectsController.getBySlug))

// Admin
projectsRouter.post(
  "/",
  requireAdmin,
  validateBody(projectCreateSchema),
  asyncHandler(projectsController.create)
)
projectsRouter.put(
  "/:id",
  requireAdmin,
  validateBody(projectUpdateSchema),
  asyncHandler(projectsController.update)
)
projectsRouter.delete("/:id", requireAdmin, asyncHandler(projectsController.remove))

// Tag assignment (Admin)
// Set/replace the whole tag list for a project.
projectsRouter.put(
  "/:id/tags",
  requireAdmin,
  validateBody(tagIdsSchema),
  asyncHandler(projectsController.setTags)
)

// Add tags to a project (keeps existing ones).
projectsRouter.post(
  "/:id/tags",
  requireAdmin,
  validateBody(tagIdsSchema),
  asyncHandler(projectsController.addTags)
)

// Remove a single tag from a project.
projectsRouter.delete(
  "/:id/tags/:tagId",
  requireAdmin,
  asyncHandler(projectsController.removeTag)
)

// Project images (Admin)
projectsRouter.get(
  "/:projectId/images",
  asyncHandler(imagesController.listForProject)
)

// Attach an existing image asset to a project
projectsRouter.post(
  "/:projectId/images/attach",
  requireAdmin,
  validateBody(attachImageSchema),
  asyncHandler(imagesController.attachToProject)
)

// Create + attach via upload
projectsRouter.post(
  "/:projectId/images",
  requireAdmin,
  upload.single("image"),
  asyncHandler(imagesController.uploadForProject)
)

// Create + attach via URL
projectsRouter.post(
  "/:projectId/images/url",
  requireAdmin,
  validateBody(createProjectImageByUrlSchema),
  asyncHandler(imagesController.addUrlForProject)
)

// Update join metadata
projectsRouter.patch(
  "/:projectId/images/:imageId",
  requireAdmin,
  asyncHandler(imagesController.updateForProject)
)

// Reorder join rows
projectsRouter.put(
  "/:projectId/images/reorder",
  requireAdmin,
  validateBody(reorderProjectImagesSchema),
  asyncHandler(imagesController.reorderForProject)
)

// Detach from project (join delete)
projectsRouter.delete(
  "/:projectId/images/:imageId",
  requireAdmin,
  asyncHandler(imagesController.removeForProject)
)

