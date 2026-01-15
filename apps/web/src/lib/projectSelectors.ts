import type { Project, ProjectImage } from "./types"

export function getProjectHeroImage(project: Project): ProjectImage | undefined {
  return project.images?.find((img) => img.type === "hero")
}

export function getProjectThumbnailImage(project: Project): ProjectImage | undefined {
  return project.images?.find((img) => img.type === "thumbnail")
}

export function getProjectGalleryImages(project: Project): ProjectImage[] {
  const images = (project.images ?? []).filter((img) => img.type === "gallery")
  // Backend already orders by orderIndex, but keep this for safety.
  return [...images].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
}

export function getProjectTagNames(project: Project): string[] {
  return (project.tags ?? []).map((t) => t.tag.name)
}
