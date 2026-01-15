import { z } from "zod"

export const projectCreateSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  short_description: z.string().min(1),
  description: z.string().min(1),
  key_features: z.array(z.string().min(1)).default([]),
  type: z.enum(["personal", "work"]),
  status: z.enum(["live", "dev", "archived"]),
  external_url: z.string().url().nullable().optional(),
  github_url: z.string().url().nullable().optional(),
  tag_ids: z.array(z.string().uuid()).optional(),
})

export const projectUpdateSchema = projectCreateSchema.partial()
