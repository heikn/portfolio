import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { api } from "@/lib/api"
import type { Project } from "@/lib/types"

export const projectsQueryKey = ["projects"] as const
export const projectQueryKey = (slug: string) => ["projects", slug] as const

export type ProjectCreateInput = {
  title: string
  slug: string
  short_description: string
  description: string
  key_features?: string[]
  type: "personal" | "work"
  status: "live" | "dev" | "archived"
  external_url?: string | null
  github_url?: string | null
  tag_ids?: string[]
}

export type ProjectUpdateInput = Partial<ProjectCreateInput>

export function useProjects() {
  return useQuery<Project[], Error>({
    queryKey: projectsQueryKey,
    queryFn: async () => {
      return api.get("projects").json<Project[]>()
    },
  })
}

// NOTE: Backend only supports GET /projects/:slug publicly.
export function useProjectBySlug(slug: string | undefined) {
  return useQuery<Project, Error>({
    queryKey: slug ? projectQueryKey(slug) : ["projects", "missing-slug"],
    enabled: Boolean(slug),
    queryFn: async () => {
      if (!slug) throw new Error("Missing project slug")
      return api.get(`projects/${encodeURIComponent(slug)}`).json<Project>()
    },
  })
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation<Project, Error, ProjectCreateInput>({
    mutationFn: async (payload) => {
      return api.post("projects", { json: payload }).json<Project>()
    },
    onSuccess: async () => {
      toast.success("Project created")
      await qc.invalidateQueries({ queryKey: projectsQueryKey })
    },
  })
}

export function useUpdateProject() {
  const qc = useQueryClient()
  return useMutation<Project, Error, { id: string; data: ProjectUpdateInput }>({
    mutationFn: async ({ id, data }) => {
      return api.put(`projects/${id}`, { json: data }).json<Project>()
    },
    onSuccess: async (project) => {
      toast.success("Project saved")
      await qc.invalidateQueries({ queryKey: projectsQueryKey })
      await qc.invalidateQueries({ queryKey: projectQueryKey(project.slug) })
    },
  })
}

export function useDeleteProject() {
  const qc = useQueryClient()
  return useMutation<void, Error, { id: string }>({
    mutationFn: async ({ id }) => {
      await api.delete(`projects/${id}`)
    },
    onSuccess: async () => {
      toast.success("Project deleted")
      await qc.invalidateQueries({ queryKey: projectsQueryKey })
    },
  })
}
