import { useMutation } from "@tanstack/react-query"
import type { HTTPError } from "ky"
import { toast } from "sonner"
import { api } from "@/lib/api"
import type { ApiError, ContactPayload } from "@/lib/types"

async function readErrorMessage(err: unknown): Promise<string> {
  if (err instanceof Error) {
    return err.message
  }

  return "Something went wrong"
}

export function useSendContactMessage() {
  return useMutation<void, Error, ContactPayload>({
    mutationFn: async (payload) => {
      await api.post("contact", { json: payload })
    },
    onSuccess: () => {
      toast.success("Message sent!")
    },
    onError: async (err) => {
      // Ky throws HTTPError for non-2xx; try to read JSON error body if present.
      if ((err as unknown as { name?: string }).name === "HTTPError") {
        const httpErr = err as unknown as HTTPError
        try {
          const body = (await httpErr.response.json()) as Partial<ApiError>
          toast.error(body.message ?? "Failed to send message")
          return
        } catch {
          toast.error("Failed to send message")
          return
        }
      }

      toast.error(await readErrorMessage(err))
    },
  })
}
