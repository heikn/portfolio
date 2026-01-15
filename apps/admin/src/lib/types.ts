export type ApiError = {
  message: string
}

export type Tag = {
  id: string
  name: string
  slug: string
}

export type ImageAsset = {
  id: string
  url: string
  createdAt: string
}

export type ProjectType = "personal" | "work"

export type ProjectStatus = "live" | "dev" | "archived"

export type ImageType = "hero" | "gallery" | "thumbnail"

export type ProjectTag = {
  projectId: string
  tagId: string
  tag: Tag
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
  id: string
  title: string
  slug: string
  shortDescription: string
  description: string
  keyFeatures: string[]
  type: ProjectType
  status: ProjectStatus
  externalUrl: string | null
  githubUrl: string | null
  createdAt: string
  updatedAt: string
  tags: ProjectTag[]
  images: ProjectImage[]
}

export type AdminLoginResponse = {
  token: string
  token_type: "Bearer"
  expires_in: number
}
