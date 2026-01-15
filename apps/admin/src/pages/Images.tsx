import { useMemo, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAddImageByUrl, useDeleteImage, useImages, useUploadImage } from "@/lib/hooks/useImages"

export default function Images() {
  const { data: images, isLoading, error } = useImages()
  const uploadImage = useUploadImage()
  const addByUrl = useAddImageByUrl()
  const deleteImage = useDeleteImage()

  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState("")

  const sorted = useMemo(() => {
    return [...(images ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [images])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Images</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage reusable image assets. Upload a file or add an external URL.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload</CardTitle>
            <CardDescription>Uploads to the API and stores an asset with an absolute URL.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-3"
              onSubmit={async (e) => {
                e.preventDefault()
                if (!file) {
                  toast.error("Pick a file first")
                  return
                }
                await uploadImage.mutateAsync({ file })
                setFile(null)
                const el = document.getElementById("image-file") as HTMLInputElement | null
                if (el) el.value = ""
              }}>
              <Input
                id="image-file"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <Button type="submit" disabled={uploadImage.isPending || !file}>
                {uploadImage.isPending ? "Uploading…" : "Upload"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add by URL</CardTitle>
            <CardDescription>Stores a reusable image asset referencing an external URL.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-3"
              onSubmit={async (e) => {
                e.preventDefault()
                await addByUrl.mutateAsync({ url: url.trim() })
                setUrl("")
              }}>
              <Input
                type="url"
                placeholder="https://example.com/image.png"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
              <Button type="submit" disabled={addByUrl.isPending || !url.trim()}>
                {addByUrl.isPending ? "Adding…" : "Add"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All images</CardTitle>
          <CardDescription>
            {isLoading
              ? "Loading…"
              : images
                ? `${images.length} total`
                : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-sm text-destructive">{error.message}</div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map((img) => (
              <div key={img.id} className="rounded-lg border overflow-hidden bg-card">
                <div className="aspect-video bg-muted">
                  <img
                    src={img.url}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 space-y-2">
                  <div className="text-xs text-muted-foreground font-mono break-all">
                    {img.url}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        await navigator.clipboard.writeText(img.url)
                        toast.success("Copied URL")
                      }}>
                      Copy URL
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deleteImage.isPending}
                      onClick={async () => {
                        const ok = window.confirm(
                          "Delete this image asset completely? It will be detached from all projects."
                        )
                        if (!ok) return
                        await deleteImage.mutateAsync({ id: img.id })
                      }}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!isLoading && (images?.length ?? 0) === 0 ? (
            <div className="text-sm text-muted-foreground">No images yet.</div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
