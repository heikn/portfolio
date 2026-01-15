import type { RequestHandler } from "express"
import { z } from "zod"

import { projectsService } from "../services/projectsService.js"
import { HttpError } from "../lib/httpError.js"

const uuidParam = z.string().uuid()

export const imagesController = {
  // POST /api/images (multipart/form-data)
  upload: (async (req, res) => {
    const file = req.file
    if (!file) throw new HttpError(400, "Missing image file (field name: image)")

    // Stored locally and served via /uploads.
    // IMPORTANT: use an absolute URL so clients hosted on a different origin
    // (e.g. Vite dev server) still fetch images from the API.
  const baseUrl = `${req.protocol}://${req.get("host")}`
    const url = `${baseUrl}/uploads/${file.filename}`

    // Asset-only create
    const image = await projectsService.createImageAsset({ url })

    res.status(201).json(image)
  }) satisfies RequestHandler,

  // POST /api/images/url (JSON)
  addUrl: (async (req, res) => {
    const body = z
      .object({
        url: z.string().url(),
      })
      .parse(req.body)

    const image = await projectsService.createImageAsset({ url: body.url })

    res.status(201).json(image)
  }) satisfies RequestHandler,

  // GET /api/images
  list: (async (_req, res) => {
    const images = await projectsService.listImageAssets()
    res.json(images)
  }) satisfies RequestHandler,

  // DELETE /api/images/:imageId
  remove: (async (req, res) => {
    const imageId = uuidParam.parse(req.params.imageId)
    // Top-level delete: delete the image asset completely.
    await projectsService.deleteImageAsset(imageId)
    res.status(204).send()
  }) satisfies RequestHandler,

  // GET /api/projects/:projectId/images
  listForProject: (async (req, res) => {
    const projectId = uuidParam.parse(req.params.projectId)
    const images = await projectsService.listImages(projectId)
    res.json(images)
  }) satisfies RequestHandler,

  // POST /api/projects/:projectId/images/attach (JSON)
  attachToProject: (async (req, res) => {
    const projectId = uuidParam.parse(req.params.projectId)
    const body = z
      .object({
        image_id: z.string().uuid(),
        type: z.enum(["hero", "gallery", "thumbnail"]),
        alt_text: z.string().min(1).nullable().optional(),
        order_index: z.number().int().optional(),
      })
      .parse(req.body)

    const join = await projectsService.attachImageToProject({
      projectId,
      imageId: body.image_id,
      type: body.type,
      alt_text: body.alt_text ?? null,
      order_index: body.order_index ?? 0,
    })

    res.status(201).json(join)
  }) satisfies RequestHandler,

  // POST /api/projects/:projectId/images (multipart/form-data)
  uploadForProject: (async (req, res) => {
    const projectId = uuidParam.parse(req.params.projectId)

    const file = req.file
    if (!file) throw new HttpError(400, "Missing image file (field name: image)")

    const type = z.enum(["hero", "gallery", "thumbnail"]).parse(req.body.type)
    const orderIndex = Number(req.body.order_index ?? 0)

  // Stored locally and served via /uploads (absolute URL for cross-origin clients)
  const baseUrl = `${req.protocol}://${req.get("host")}/api`
  const url = `${baseUrl}/uploads/${file.filename}`

    const image = await projectsService.addImage({
      projectId,
      url,
      alt_text: req.body.alt_text ?? null,
      type,
      order_index: Number.isFinite(orderIndex) ? orderIndex : 0,
    })

    res.status(201).json(image)
  }) satisfies RequestHandler,

  // POST /api/projects/:projectId/images/url (JSON)
  addUrlForProject: (async (req, res) => {
    const projectId = uuidParam.parse(req.params.projectId)

    const body = z
      .object({
        url: z.string().url(),
        alt_text: z.string().min(1).nullable().optional(),
        type: z.enum(["hero", "gallery", "thumbnail"]),
        order_index: z.number().int().optional(),
      })
      .parse(req.body)

    const image = await projectsService.addImageFromUrl({
      projectId,
      url: body.url,
      alt_text: body.alt_text ?? null,
      type: body.type,
      order_index: body.order_index ?? 0,
    })

    res.status(201).json(image)
  }) satisfies RequestHandler,

  // PATCH /api/projects/:projectId/images/:imageId
  updateForProject: (async (req, res) => {
    const projectId = uuidParam.parse(req.params.projectId)
    const imageId = uuidParam.parse(req.params.imageId)

    const body = z
      .object({
        alt_text: z.string().min(1).nullable().optional(),
        type: z.enum(["hero", "gallery", "thumbnail"]).optional(),
        order_index: z.number().int().optional(),
      })
      .parse(req.body)

    const image = await projectsService.updateImage(projectId, imageId, body)
    res.json(image)
  }) satisfies RequestHandler,

  // PUT /api/projects/:projectId/images/reorder
  reorderForProject: (async (req, res) => {
    const projectId = uuidParam.parse(req.params.projectId)

    const parsed = z
      .object({
        items: z.array(
          z.object({
            id: z.string().uuid(),
            order_index: z.number().int(),
          })
        ),
      })
      .parse(req.body)

    const images = await projectsService.reorderImages(projectId, parsed.items)
    res.json(images)
  }) satisfies RequestHandler,

  // DELETE /api/projects/:projectId/images/:imageId
  removeForProject: (async (req, res) => {
    const projectId = uuidParam.parse(req.params.projectId)
    const imageId = uuidParam.parse(req.params.imageId)

    await projectsService.removeImage(projectId, imageId)
    res.status(204).send()
  }) satisfies RequestHandler,
}
