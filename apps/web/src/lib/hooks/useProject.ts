import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { Project } from "@/lib/types"

export const projectQueryKey = (slug: string) => ["projects", slug] as const

export function useProject(slug: string | undefined) {
  return useQuery<Project, Error>({
    queryKey: slug ? projectQueryKey(slug) : ["projects", "missing-slug"],
    enabled: Boolean(slug),
    queryFn: async () => {
      if (!slug) {
        throw new Error("Missing project slug")
      }
      return api.get(`projects/${encodeURIComponent(slug)}`).json<Project>()
    },
  })
}
