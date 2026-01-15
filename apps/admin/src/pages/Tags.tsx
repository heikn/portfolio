import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useCreateTag, useDeleteTag, useTags } from "@/lib/hooks/useTags"

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function Tags() {
  const { data: tags, isLoading, error } = useTags()
  const createTag = useCreateTag()
  const deleteTag = useDeleteTag()

  const [name, setName] = useState("")
  const derivedSlug = useMemo(() => slugify(name), [name])
  const [slug, setSlug] = useState("")

  const effectiveSlug = slug.trim() ? slugify(slug) : derivedSlug

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Tags</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create and manage tags used to categorize projects.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create tag</CardTitle>
          <CardDescription>Name is shown in UI; slug is used in URLs.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end"
            onSubmit={async (e) => {
              e.preventDefault()
              await createTag.mutateAsync({
                name: name.trim(),
                slug: effectiveSlug,
              })
              setName("")
              setSlug("")
            }}>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="tag-name">
                Name
              </label>
              <Input
                id="tag-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="React"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="tag-slug">
                Slug
              </label>
              <Input
                id="tag-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder={derivedSlug || "react"}
              />
              <div className="text-xs text-muted-foreground">
                Will use: <span className="font-mono">{effectiveSlug || "-"}</span>
              </div>
            </div>

            <Button type="submit" disabled={createTag.isPending || !effectiveSlug}>
              {createTag.isPending ? "Creating…" : "Create"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All tags</CardTitle>
          <CardDescription>
            {isLoading
              ? "Loading…"
              : tags
                ? `${tags.length} total`
                : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-sm text-destructive">{error.message}</div>
          ) : null}

          <div className="divide-y rounded-md border">
            {(tags ?? []).map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3">
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{t.slug}</div>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deleteTag.isPending}
                  onClick={async () => {
                    const ok = window.confirm(
                      `Delete tag "${t.name}"? This will remove it from projects as well.`
                    )
                    if (!ok) return
                    await deleteTag.mutateAsync({ id: t.id })
                  }}>
                  Delete
                </Button>
              </div>
            ))}

            {!isLoading && (tags?.length ?? 0) === 0 ? (
              <div className="p-3 text-sm text-muted-foreground">No tags yet.</div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
