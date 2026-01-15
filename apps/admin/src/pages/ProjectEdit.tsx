import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { useTags } from "@/lib/hooks/useTags"
import { useProjectBySlug, useUpdateProject } from "@/lib/hooks/useProjects"
import type { ImageType, Project, ProjectStatus, ProjectType } from "@/lib/types"

type ImageAsset = {
  id: string
  url: string
}

function toCommaList(items: string[]) {
  return items.join(", ")
}

function fromCommaList(s: string) {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
}

export default function ProjectEdit() {
  const params = useParams()
  const navigate = useNavigate()

  // For now we navigate by slug (because backend has GET /projects/:slug, not /projects/:id).
  const slug = params.slug

  const { data: project, isLoading, error } = useProjectBySlug(slug)
  const updateProject = useUpdateProject()

  const { data: allTags } = useTags()

  const [draft, setDraft] = useState<Project | null>(null)

  const [imageAssets, setImageAssets] = useState<ImageAsset[] | null>(null)
  const [assetSearch, setAssetSearch] = useState("")
  const [attachImageId, setAttachImageId] = useState<string>("")
  const [attachType, setAttachType] = useState<ImageType>("gallery")
  const [attachOrderIndex, setAttachOrderIndex] = useState<string>("")
  const [isAttaching, setIsAttaching] = useState(false)

  const [isReordering, setIsReordering] = useState(false)

  useEffect(() => {
    if (project) setDraft(project)
  }, [project])

  useEffect(() => {
    // Load available image assets once for the picker.
    let cancelled = false
    ;(async () => {
      try {
        const assets = await api.get("images").json<ImageAsset[]>()
        if (!cancelled) setImageAssets(assets)
      } catch {
        if (!cancelled) setImageAssets([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const selectedTagIds = useMemo(() => {
    return new Set((draft?.tags ?? []).map((t) => t.tagId))
  }, [draft])

  const filteredAssets = useMemo(() => {
    const assets = imageAssets ?? []
    const q = assetSearch.trim().toLowerCase()
    if (!q) return assets
    return assets.filter((a) => a.url.toLowerCase().includes(q))
  }, [imageAssets, assetSearch])

  function sortProjectImages(images: Project["images"]) {
    return [...images].sort((a, b) => a.orderIndex - b.orderIndex)
  }

  async function commitReorder(images: Project["images"]) {
    setIsReordering(true)
    try {
      const items = images.map((x, idx) => ({ id: x.imageId, order_index: idx }))
      await api.put(`projects/${draft!.id}/images/reorder`, { json: { items } })
      setDraft({ ...draft!, images: images.map((x, idx) => ({ ...x, orderIndex: idx })) })
    } finally {
      setIsReordering(false)
    }
  }

  if (!slug) {
    return (
      <div className="space-y-3">
        <div className="text-sm text-destructive">Missing project slug</div>
        <Button asChild variant="outline">
          <Link to="/projects">Back</Link>
        </Button>
      </div>
    )
  }

  if (isLoading || !draft) {
    return <div className="text-sm text-muted-foreground">Loading…</div>
  }

  if (error) {
    return (
      <div className="space-y-3">
        <div className="text-sm text-destructive">{error.message}</div>
        <Button asChild variant="outline">
          <Link to="/projects">Back</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Edit project</h1>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-mono">{draft.slug}</span>
          </p>
        </div>

        <Button asChild variant="outline">
          <Link to="/projects">Back</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>Basic project fields.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault()
              await updateProject.mutateAsync({
                id: draft.id,
                data: {
                  title: draft.title,
                  slug: draft.slug,
                  short_description: draft.shortDescription,
                  description: draft.description,
                  key_features: draft.keyFeatures,
                  type: draft.type as ProjectType,
                  status: draft.status as ProjectStatus,
                  external_url: draft.externalUrl,
                  github_url: draft.githubUrl,
                },
              })
            }}>
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="p-title">
                  Title
                </label>
                <Input
                  id="p-title"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="p-slug">
                  Slug
                </label>
                <Input
                  id="p-slug"
                  value={draft.slug}
                  onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="p-short">
                  Short description
                </label>
                <Input
                  id="p-short"
                  value={draft.shortDescription}
                  onChange={(e) => setDraft({ ...draft, shortDescription: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="p-external">
                  External URL
                </label>
                <Input
                  id="p-external"
                  value={draft.externalUrl ?? ""}
                  onChange={(e) => setDraft({ ...draft, externalUrl: e.target.value || null })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="p-github">
                  GitHub URL
                </label>
                <Input
                  id="p-github"
                  value={draft.githubUrl ?? ""}
                  onChange={(e) => setDraft({ ...draft, githubUrl: e.target.value || null })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="p-type">
                    Type
                  </label>
                  <select
                    id="p-type"
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                    value={draft.type}
                    onChange={(e) => setDraft({ ...draft, type: e.target.value as ProjectType })}>
                    <option value="personal">personal</option>
                    <option value="work">work</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium" htmlFor="p-status">
                    Status
                  </label>
                  <select
                    id="p-status"
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                    value={draft.status}
                    onChange={(e) => setDraft({ ...draft, status: e.target.value as ProjectStatus })}>
                    <option value="live">live</option>
                    <option value="dev">dev</option>
                    <option value="archived">archived</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="p-features">
                  Key features (comma separated)
                </label>
                <Input
                  id="p-features"
                  value={toCommaList(draft.keyFeatures ?? [])}
                  onChange={(e) => setDraft({ ...draft, keyFeatures: fromCommaList(e.target.value) })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium" htmlFor="p-desc">
                  Description
                </label>
                <textarea
                  id="p-desc"
                  className="min-h-32 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                />
              </div>
            </div>

            <Button type="submit" disabled={updateProject.isPending}>
              {updateProject.isPending ? "Saving…" : "Save"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
          <CardDescription>Attach/detach tags for this project.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-2">
            {(allTags ?? []).map((t) => {
              const checked = selectedTagIds.has(t.id)
              return (
                <label key={t.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={async (e) => {
                      const nextChecked = e.target.checked
                      if (nextChecked) {
                        const updated = await api
                          .post(`projects/${draft.id}/tags`, { json: { tag_ids: [t.id] } })
                          .json<Project>()
                        setDraft(updated)
                      } else {
                        const updated = await api
                          .delete(`projects/${draft.id}/tags/${t.id}`)
                          .json<Project>()
                        setDraft(updated)
                      }
                    }}
                  />
                  <span>{t.name}</span>
                  <span className="ml-auto font-mono text-xs text-muted-foreground">{t.slug}</span>
                </label>
              )
            })}
          </div>

          {(allTags?.length ?? 0) === 0 ? (
            <div className="text-sm text-muted-foreground">No tags exist yet.</div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
          <CardDescription>Attach/detach and edit per-project image metadata.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 rounded-md border p-3">
            <div className="text-sm font-medium">Attach existing image asset</div>

            <div className="grid grid-cols-1 gap-2">
              <Input
                value={assetSearch}
                onChange={(e) => setAssetSearch(e.target.value)}
                placeholder="Search by URL…"
              />

              <select
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                value={attachImageId}
                onChange={(e) => setAttachImageId(e.target.value)}>
                <option value="">Select an image…</option>
                {filteredAssets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.url}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-3 gap-2">
                <select
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                  value={attachType}
                  onChange={(e) => setAttachType(e.target.value as ImageType)}>
                  <option value="hero">hero</option>
                  <option value="thumbnail">thumbnail</option>
                  <option value="gallery">gallery</option>
                </select>

                <Input
                  value={attachOrderIndex}
                  onChange={(e) => setAttachOrderIndex(e.target.value)}
                  placeholder={`Order (default ${draft.images.length})`}
                />

                <Button
                  disabled={!attachImageId || isAttaching}
                  onClick={async () => {
                    if (!attachImageId) return
                    const attached = new Set((draft.images ?? []).map((x) => x.imageId))
                    if (attached.has(attachImageId)) {
                      window.alert("That image is already attached to this project.")
                      return
                    }

                    setIsAttaching(true)
                    try {
                      const orderIndex = attachOrderIndex.trim() ? Number(attachOrderIndex.trim()) : draft.images.length
                      const join = await api
                        .post(`projects/${draft.id}/images/attach`, {
                          json: { image_id: attachImageId, type: attachType, order_index: orderIndex },
                        })
                        .json<Project["images"][number]>()

                      const nextImages = sortProjectImages([...draft.images, join]).map((x, idx) => ({
                        ...x,
                        orderIndex: idx,
                      }))
                      setDraft({ ...draft, images: nextImages })
                      setAttachImageId("")
                      setAttachOrderIndex("")
                    } finally {
                      setIsAttaching(false)
                    }
                  }}>
                  {isAttaching ? "Attaching…" : "Attach"}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  navigate("/images")
                }}>
                Manage assets
              </Button>
              <div className="text-xs text-muted-foreground">
                Tip: upload/add-by-URL on the Images page first.
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {sortProjectImages(draft.images ?? []).map((pi, idx, arr) => (
              <div key={pi.imageId} className="flex items-center gap-3 rounded-md border p-2">
                <div className="h-12 w-20 overflow-hidden rounded bg-muted">
                  <img src={pi.image.url} alt={pi.altText ?? ""} className="h-full w-full object-cover" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-xs font-mono break-all text-muted-foreground">{pi.image.url}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isReordering || idx === 0}
                        onClick={async () => {
                          const images = sortProjectImages(draft.images)
                          const next = [...images]
                          ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
                          setDraft({ ...draft, images: next.map((x, i) => ({ ...x, orderIndex: i })) })
                          await commitReorder(next)
                        }}>
                        ↑
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isReordering || idx === arr.length - 1}
                        onClick={async () => {
                          const images = sortProjectImages(draft.images)
                          const next = [...images]
                          ;[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]]
                          setDraft({ ...draft, images: next.map((x, i) => ({ ...x, orderIndex: i })) })
                          await commitReorder(next)
                        }}>
                        ↓
                      </Button>
                    </div>

                    <select
                      className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
                      value={pi.type}
                      onChange={async (e) => {
                        const updatedJoin = await api
                          .patch(`projects/${draft.id}/images/${pi.imageId}`, {
                            json: { type: e.target.value as ImageType },
                          })
                          .json<typeof pi>()

                        setDraft({
                          ...draft,
                          images: draft.images.map((x) =>
                            x.imageId === pi.imageId ? { ...x, ...updatedJoin } : x
                          ),
                        })
                      }}>
                      <option value="hero">hero</option>
                      <option value="thumbnail">thumbnail</option>
                      <option value="gallery">gallery</option>
                    </select>

                    <Input
                      className="h-8"
                      value={pi.altText ?? ""}
                      placeholder="Alt text"
                      onChange={async (e) => {
                        const value = e.target.value
                        setDraft({
                          ...draft,
                          images: draft.images.map((x) =>
                            x.imageId === pi.imageId ? { ...x, altText: value } : x
                          ),
                        })
                      }}
                      onBlur={async () => {
                        await api.patch(`projects/${draft.id}/images/${pi.imageId}`, {
                          json: { alt_text: (draft.images.find((x) => x.imageId === pi.imageId)?.altText ?? "") || null },
                        })
                      }}
                    />

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={async () => {
                        const ok = window.confirm("Detach this image from the project?")
                        if (!ok) return
                        await api.delete(`projects/${draft.id}/images/${pi.imageId}`)
                        const nextImages = sortProjectImages(
                          draft.images.filter((x) => x.imageId !== pi.imageId)
                        ).map((x, i) => ({ ...x, orderIndex: i }))
                        setDraft({ ...draft, images: nextImages })
                        // keep backend order indexes compact
                        await commitReorder(nextImages)
                      }}>
                      Detach
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {(draft.images?.length ?? 0) === 0 ? (
              <div className="text-sm text-muted-foreground">No images attached.</div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
