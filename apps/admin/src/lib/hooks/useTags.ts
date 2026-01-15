import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { api } from "@/lib/api"
import type { Tag } from "@/lib/types"

export const tagsQueryKey = ["tags"] as const

export function useTags() {
  return useQuery<Tag[], Error>({
    queryKey: tagsQueryKey,
    queryFn: async () => {
      return api.get("tags").json<Tag[]>()
    },
  })
}

export function useCreateTag() {
  const qc = useQueryClient()
  return useMutation<Tag, Error, { name: string; slug: string }>({
    mutationFn: async (payload) => {
      return api.post("tags", { json: payload }).json<Tag>()
    },
    onSuccess: async () => {
      toast.success("Tag created")
      await qc.invalidateQueries({ queryKey: tagsQueryKey })
    },
  })
}

export function useDeleteTag() {
  const qc = useQueryClient()
  return useMutation<void, Error, { id: string }>({
    mutationFn: async ({ id }) => {
      await api.delete(`tags/${id}`)
    },
    onSuccess: async () => {
      toast.success("Tag deleted")
      await qc.invalidateQueries({ queryKey: tagsQueryKey })
    },
  })
}
