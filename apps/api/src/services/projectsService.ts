import { prisma } from "../lib/prisma.js"
import { HttpError } from "../lib/httpError.js"
import type { ImageType, ProjectStatus, ProjectType } from "@prisma/client"
import path from "node:path"
import { promises as fs } from "node:fs"

export const projectsService = {
  async listImageAssets() {
    return prisma.image.findMany({ orderBy: { createdAt: "desc" } })
  },

  async createImageAsset(input: { url: string }) {
    // URL is unique; if it's already there, just return it.
    return prisma.image.upsert({
      where: { url: input.url },
      create: { url: input.url },
      update: {},
    })
  },

  async listPublic() {
    return prisma.project.findMany({
      where: { status: { in: ["live", "dev"] } },
      orderBy: { createdAt: "desc" },
      include: {
        tags: { include: { tag: true } },
        images: { orderBy: { orderIndex: "asc" }, include: { image: true } },
      },
    })
  },

  async getBySlug(slug: string) {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        tags: { include: { tag: true } },
        images: { orderBy: { orderIndex: "asc" }, include: { image: true } },
      },
    })
    if (!project) throw new HttpError(404, "Project not found")
    return project
  },

  async create(input: {
    title: string
    slug: string
    short_description: string
    description: string
    keyFeatures?: string[]
    type: ProjectType
    status: ProjectStatus
    external_url?: string | null
    githubUrl?: string | null
    tag_ids?: string[]
  }) {
    return prisma.project.create({
      data: {
        title: input.title,
        slug: input.slug,
        shortDescription: input.short_description,
        description: input.description,
        keyFeatures: input.keyFeatures ?? [],
        type: input.type,
        status: input.status,
        externalUrl: input.external_url ?? null,
        githubUrl: input.githubUrl ?? null,
        tags: input.tag_ids
          ? {
              create: input.tag_ids.map((tagId) => ({ tagId })),
            }
          : undefined,
      } as any,
      include: { tags: { include: { tag: true } }, images: { include: { image: true } } },
    })
  },

  async update(id: string, input: {
    title?: string
    slug?: string
    short_description?: string
    description?: string
    keyFeatures?: string[]
    type?: ProjectType
    status?: ProjectStatus
    external_url?: string | null
    githubUrl?: string | null
    tag_ids?: string[]
  }) {
    // If tag_ids is provided, we replace the join rows.
    const data: any = {
      ...(input.title !== undefined ? { title: input.title } : null),
      ...(input.slug !== undefined ? { slug: input.slug } : null),
      ...(input.short_description !== undefined ? { shortDescription: input.short_description } : null),
      ...(input.description !== undefined ? { description: input.description } : null),
      ...(input.keyFeatures !== undefined ? { keyFeatures: input.keyFeatures } : null),
      ...(input.type !== undefined ? { type: input.type } : null),
      ...(input.status !== undefined ? { status: input.status } : null),
      ...(input.external_url !== undefined ? { externalUrl: input.external_url } : null),
      ...(input.githubUrl !== undefined ? { githubUrl: input.githubUrl } : null),
    }

    if (input.tag_ids) {
      data.tags = {
        deleteMany: {},
        create: input.tag_ids.map((tagId) => ({ tagId })),
      }
    }

    try {
      return await prisma.project.update({
        where: { id },
        data,
        include: { tags: { include: { tag: true } }, images: { include: { image: true } } },
      })
    } catch {
      throw new HttpError(404, "Project not found")
    }
  },

  async setTags(projectId: string, tagIds: string[]) {
    // Replace join rows for the project.
    try {
      return await prisma.project.update({
        where: { id: projectId },
        data: {
          tags: {
            deleteMany: {},
            create: tagIds.map((tagId) => ({ tagId })),
          },
        },
        include: { tags: { include: { tag: true } }, images: { include: { image: true } } },
      })
    } catch {
      throw new HttpError(404, "Project not found")
    }
  },

  async addTags(projectId: string, tagIds: string[]) {
    // Create join rows; ignore duplicates via composite PK (projectId, tagId).
    // We do this as a transaction so the response is the latest project state.
    try {
      await prisma.projectTag.createMany({
        data: tagIds.map((tagId) => ({ projectId, tagId })),
        skipDuplicates: true,
      })

      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { tags: { include: { tag: true } }, images: { include: { image: true } } },
      })
      if (!project) throw new HttpError(404, "Project not found")
      return project
    } catch (err) {
      if (err instanceof HttpError) throw err
      throw new HttpError(404, "Project not found")
    }
  },

  async removeTag(projectId: string, tagId: string) {
    try {
      await prisma.projectTag.delete({
        where: {
          projectId_tagId: { projectId, tagId },
        },
      })

      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { tags: { include: { tag: true } }, images: { include: { image: true } } },
      })
      if (!project) throw new HttpError(404, "Project not found")
      return project
    } catch {
      // If the join row doesn't exist or project doesn't exist, treat as 404.
      throw new HttpError(404, "Project/tag relation not found")
    }
  },

  async remove(id: string) {
    try {
      await prisma.project.delete({ where: { id } })
    } catch {
      throw new HttpError(404, "Project not found")
    }
  },

  async addImage(input: {
    projectId: string
    url: string
    alt_text?: string | null
    type: ImageType
    order_index: number
  }) {
    // Ensure project exists so we return a clear 404 instead of a FK error.
    const exists = await prisma.project.findUnique({ where: { id: input.projectId }, select: { id: true } })
    if (!exists) throw new HttpError(404, "Project not found")

    // Create or reuse the Image asset. URL is unique.
    const image = await this.createImageAsset({ url: input.url })

    // Create (or update) the per-project join row.
    return prisma.projectImage.upsert({
      where: { projectId_imageId: { projectId: input.projectId, imageId: image.id } },
      create: {
        projectId: input.projectId,
        imageId: image.id,
        type: input.type,
        altText: input.alt_text ?? null,
        orderIndex: input.order_index,
      },
      update: {
        type: input.type,
        altText: input.alt_text ?? null,
        orderIndex: input.order_index,
      },
      include: { image: true },
    })
  },

  async attachImageToProject(input: {
    projectId: string
    imageId: string
    type: ImageType
    alt_text?: string | null
    order_index: number
  }) {
    const project = await prisma.project.findUnique({ where: { id: input.projectId }, select: { id: true } })
    if (!project) throw new HttpError(404, "Project not found")

    const image = await prisma.image.findUnique({ where: { id: input.imageId }, select: { id: true } })
    if (!image) throw new HttpError(404, "Image not found")

    return prisma.projectImage.upsert({
      where: { projectId_imageId: { projectId: input.projectId, imageId: input.imageId } },
      create: {
        projectId: input.projectId,
        imageId: input.imageId,
        type: input.type,
        altText: input.alt_text ?? null,
        orderIndex: input.order_index,
      },
      update: {
        type: input.type,
        altText: input.alt_text ?? null,
        orderIndex: input.order_index,
      },
      include: { image: true },
    })
  },

  async addImageFromUrl(input: {
    projectId: string
    url: string
    alt_text?: string | null
    type: ImageType
    order_index: number
  }) {
    // For external URLs we only store the URL in the DB (no file downloads).
    return this.addImage(input)
  },

  async listImages(projectId: string) {
    // Validate project existence and return images in display order.
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { images: { orderBy: { orderIndex: "asc" }, include: { image: true } } },
    })
    if (!project) throw new HttpError(404, "Project not found")
    return project.images
  },

  async updateImage(
    projectId: string,
    imageId: string,
    input: { alt_text?: string | null; type?: ImageType; order_index?: number }
  ) {
    try {
      return await prisma.projectImage.update({
        where: { projectId_imageId: { projectId, imageId } },
        data: {
          ...(input.alt_text !== undefined ? { altText: input.alt_text } : null),
          ...(input.type !== undefined ? { type: input.type } : null),
          ...(input.order_index !== undefined ? { orderIndex: input.order_index } : null),
        },
        include: { image: true },
      })
    } catch {
      throw new HttpError(404, "Image not found")
    }
  },

  async reorderImages(projectId: string, items: { id: string; order_index: number }[]) {
    // Ensure project exists first.
    const exists = await prisma.project.findUnique({ where: { id: projectId }, select: { id: true } })
    if (!exists) throw new HttpError(404, "Project not found")

    await prisma.$transaction(
      items.map((it) =>
        prisma.projectImage.update({
          where: { projectId_imageId: { projectId, imageId: it.id } },
          data: { orderIndex: it.order_index },
        })
      )
    )

    return prisma.projectImage.findMany({
      where: { projectId },
      orderBy: { orderIndex: "asc" },
      include: { image: true },
    })
  },

  async removeImage(projectId: string, imageId: string) {
    // Project-scoped delete: remove the join row only.
    try {
      await prisma.projectImage.delete({ where: { projectId_imageId: { projectId, imageId } } })
    } catch {
      throw new HttpError(404, "Image not found")
    }

    return { ok: true }
  },

  async deleteImageAsset(imageId: string) {
    // Full delete: always delete the image asset (and cascade delete all join rows).
    const image = await prisma.image.findUnique({ where: { id: imageId } })
    if (!image) throw new HttpError(404, "Image not found")

    await prisma.image.delete({ where: { id: imageId } })

    // Best-effort cleanup of locally stored files (urls are like /uploads/<filename>)
    if (image.url?.startsWith("/uploads/")) {
      const filename = image.url.replace("/uploads/", "")
      const uploadsDir = path.resolve(process.cwd(), "uploads")
      const filePath = path.join(uploadsDir, filename)
      try {
        await fs.unlink(filePath)
      } catch {
        // ignore (file might not exist)
      }
    }

    return { ok: true }
  },
}
