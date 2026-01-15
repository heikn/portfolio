export type ApiError = {
  message: string
}

export type Tag = {
  id: string
  name: string
  slug: string
}

export type ProjectTag = {
  tagId: string
  projectId: string
  tag: Tag
}

export type ImageType = "hero" | "gallery" | "thumbnail"

export type ImageAsset = {
  id: string
  url: string
  createdAt: string
}

export type ProjectImage = {
  projectId: string
  imageId: string
  type: ImageType
  orderIndex: number
  altText: string | null
  image: ImageAsset
}

export type Project = {
  id?: string
  slug: string
  title: string
  shortDescription?: string
  description?: string
  keyFeatures?: string[]
  type?: "personal" | "work"
  status?: "live" | "dev" | "archived"
  externalUrl?: string | null
  liveUrl?: string | null
  createdAt?: string
  updatedAt?: string

  tags?: ProjectTag[]
  images?: ProjectImage[]

  technologies?: string[] | null
  githubUrl?: string | null
  features?: string[] | null
}

export type ContactPayload = {
  name: string
  email: string
  message: string
}
