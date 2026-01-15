import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { Project } from "@/lib/types"

export const projectsQueryKey = ["projects"] as const

export function useProjects() {
  return useQuery<Project[], Error>({
    queryKey: projectsQueryKey,
    queryFn: async () => {
      return api.get("projects").json<Project[]>()
    },
  })
}
