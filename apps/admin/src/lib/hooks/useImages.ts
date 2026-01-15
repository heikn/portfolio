import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { api } from "@/lib/api"
import type { ImageAsset } from "@/lib/types"

export const imagesQueryKey = ["images"] as const

export function useImages() {
  return useQuery<ImageAsset[], Error>({
    queryKey: imagesQueryKey,
    queryFn: async () => {
      return api.get("images").json<ImageAsset[]>()
    },
  })
}

export function useUploadImage() {
  const qc = useQueryClient()
  return useMutation<ImageAsset, Error, { file: File }>({
    mutationFn: async ({ file }) => {
      const form = new FormData()
      form.set("image", file)
      return api
        .post("images", {
          // ky supports FormData for multipart
          body: form,
        })
        .json<ImageAsset>()
    },
    onSuccess: async () => {
      toast.success("Image uploaded")
      await qc.invalidateQueries({ queryKey: imagesQueryKey })
    },
  })
}

export function useAddImageByUrl() {
  const qc = useQueryClient()
  return useMutation<ImageAsset, Error, { url: string }>({
    mutationFn: async ({ url }) => {
      return api.post("images/url", { json: { url } }).json<ImageAsset>()
    },
    onSuccess: async () => {
      toast.success("Image added")
      await qc.invalidateQueries({ queryKey: imagesQueryKey })
    },
  })
}

export function useDeleteImage() {
  const qc = useQueryClient()
  return useMutation<void, Error, { id: string }>({
    mutationFn: async ({ id }) => {
      await api.delete(`images/${id}`)
    },
    onSuccess: async () => {
      toast.success("Image deleted")
      await qc.invalidateQueries({ queryKey: imagesQueryKey })
    },
  })
}
