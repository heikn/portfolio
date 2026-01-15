import { Router } from "express"
import multer from "multer"
import path from "node:path"
import crypto from "node:crypto"
import { fileURLToPath } from "node:url"

import { imagesController } from "../controllers/imagesController.js"
import { asyncHandler } from "../middleware/asyncHandler.js"
import { validateBody } from "../middleware/validate.js"
import { z } from "zod"
import { requireAdmin } from "../middleware/requireAdmin.js"

export const imagesRouter = Router()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.resolve(__dirname, "..", "..", "uploads")

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

const createImageByUrlSchema = z.object({
  url: z.string().url(),
})

// Mounted under /api/images
// Create image asset via upload (multipart form-data with file field `image`)
imagesRouter.post("/", requireAdmin, upload.single("image"), asyncHandler(imagesController.upload))

// Create image asset via external URL
imagesRouter.post(
  "/url",
  requireAdmin,
  validateBody(createImageByUrlSchema),
  asyncHandler(imagesController.addUrl)
)

// List image assets
imagesRouter.get("/", asyncHandler(imagesController.list))

// Delete image asset (full delete)
imagesRouter.delete("/:imageId", requireAdmin, asyncHandler(imagesController.remove))
