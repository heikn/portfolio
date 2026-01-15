import type { RequestHandler } from "express"
import { z } from "zod"

import { tagsService } from "../services/tagsService.js"

const uuidParam = z.string().uuid()

export const tagsController = {
  list: (async (_req, res) => {
    const tags = await tagsService.list()
    res.json(tags)
  }) satisfies RequestHandler,

  create: (async (req, res) => {
    const tag = await tagsService.create(req.body)
    res.status(201).json(tag)
  }) satisfies RequestHandler,

  remove: (async (req, res) => {
    const id = uuidParam.parse(req.params.id)
    await tagsService.remove(id)
    res.status(204).send()
  }) satisfies RequestHandler,
}
