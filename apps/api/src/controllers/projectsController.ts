import type { RequestHandler } from "express"
import { z } from "zod"

import { projectsService } from "../services/projectsService.js"

const uuidParam = z.string().uuid()

export const projectsController = {
  list: (async (_req, res) => {
    const projects = await projectsService.listPublic()
    res.json(projects)
  }) satisfies RequestHandler,

  getBySlug: (async (req, res) => {
    const slug = req.params.slug
    const project = await projectsService.getBySlug(slug)
    res.json(project)
  }) satisfies RequestHandler,

  create: (async (req, res) => {
    const project = await projectsService.create({
      ...req.body,
      keyFeatures: req.body.key_features,
      githubUrl: req.body.github_url,
    })
    res.status(201).json(project)
  }) satisfies RequestHandler,

  update: (async (req, res) => {
    const id = uuidParam.parse(req.params.id)
    const project = await projectsService.update(id, {
      ...req.body,
      keyFeatures: req.body.key_features,
      githubUrl: req.body.github_url,
    })
    res.json(project)
  }) satisfies RequestHandler,

  remove: (async (req, res) => {
    const id = uuidParam.parse(req.params.id)
    await projectsService.remove(id)
    res.status(204).send()
  }) satisfies RequestHandler,

  setTags: (async (req, res) => {
    const projectId = uuidParam.parse(req.params.id)
    const tagIds = z.array(z.string().uuid()).parse(req.body.tag_ids ?? [])
    const project = await projectsService.setTags(projectId, tagIds)
    res.json(project)
  }) satisfies RequestHandler,

  addTags: (async (req, res) => {
    const projectId = uuidParam.parse(req.params.id)
    const tagIds = z.array(z.string().uuid()).parse(req.body.tag_ids ?? [])
    const project = await projectsService.addTags(projectId, tagIds)
    res.json(project)
  }) satisfies RequestHandler,

  removeTag: (async (req, res) => {
    const projectId = uuidParam.parse(req.params.id)
    const tagId = uuidParam.parse(req.params.tagId)
    const project = await projectsService.removeTag(projectId, tagId)
    res.json(project)
  }) satisfies RequestHandler,
}
