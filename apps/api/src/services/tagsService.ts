import { prisma } from "../lib/prisma.js"
import { HttpError } from "../lib/httpError.js"

export const tagsService = {
  async list() {
    return prisma.tag.findMany({ orderBy: { name: "asc" } })
  },

  async create(input: { name: string; slug: string }) {
    const name = input.name.trim()
    const slug = input.slug.trim().toLowerCase()

    try {
      return await prisma.tag.create({ data: { name, slug } })
    } catch (err: any) {
      // Prisma unique constraint violation: https://www.prisma.io/docs/orm/reference/error-reference#p2002
      if (err?.code === "P2002") {
        const targets = (err?.meta?.target ?? []) as unknown
        const targetStr = Array.isArray(targets) ? targets.join(", ") : String(targets)

        if (targetStr.includes("slug")) {
          throw new HttpError(400, "Tag slug must be unique")
        }
        if (targetStr.includes("name")) {
          throw new HttpError(400, "Tag name must be unique")
        }

        throw new HttpError(400, "Tag must be unique")
      }

      throw err
    }
  },

  async remove(id: string) {
    try {
      await prisma.tag.delete({ where: { id } })
    } catch {
      throw new HttpError(404, "Tag not found")
    }
  },
}
