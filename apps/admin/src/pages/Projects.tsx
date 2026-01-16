import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCreateProject, useDeleteProject, useProjects, useReorderProjects } from "@/lib/hooks/useProjects"
import { Input } from "@/components/ui/input"
import { useMemo, useState } from "react"
import { toast } from "sonner"

export default function Projects() {
  const navigate = useNavigate()
  const { data, isLoading, error } = useProjects()

  const [draftOrder, setDraftOrder] = useState<Record<string, number>>({})

  const projects = data ?? []

  const createProject = useCreateProject()
  const deleteProject = useDeleteProject()
  const reorderProjects = useReorderProjects()

  const orderedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      const ai = typeof draftOrder[a.id] === "number" ? draftOrder[a.id] : a.orderIndex ?? 0
      const bi = typeof draftOrder[b.id] === "number" ? draftOrder[b.id] : b.orderIndex ?? 0
      return ai - bi
    })
  }, [projects, draftOrder])

  const hasDraftChanges = Object.keys(draftOrder).length > 0

  const draftHasDuplicates = useMemo(() => {
    const indexes = orderedProjects.map((p) => {
      const v = typeof draftOrder[p.id] === "number" ? draftOrder[p.id] : p.orderIndex
      return Number(v)
    })
    return new Set(indexes).size !== indexes.length
  }, [orderedProjects, draftOrder])

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading…</div>
  if (error) return <div className="text-sm text-destructive">{error.message}</div>

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">Create, edit, and organize your projects.</p>
        </div>

        <Button
          onClick={async () => {
            const created = await createProject.mutateAsync({
              title: "New project",
              slug: `new-project-${Date.now()}`,
              order_index: projects.length,
              short_description: "TODO",
              description: "TODO",
              type: "personal",
              status: "dev",
              key_features: [],
              external_url: null,
              github_url: null,
            })

            navigate(`projects/${created.slug}`)
          }}
          disabled={createProject.isPending}>
          {createProject.isPending ? "Creating…" : "Add new"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All projects</CardTitle>
          <CardDescription>Click a project to edit.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground">
                Tip: set unique numbers (0,1,2,…) to control the public Projects order.
              </div>
              <Button
                size="sm"
                disabled={!hasDraftChanges || reorderProjects.isPending || draftHasDuplicates}
                onClick={async () => {
                  if (draftHasDuplicates) {
                    toast.error("Order indexes must be unique")
                    return
                  }

                  const items = orderedProjects.map((p) => {
                    const v = typeof draftOrder[p.id] === "number" ? draftOrder[p.id] : p.orderIndex
                    return { id: p.id, order_index: Number(v) }
                  })

                  await reorderProjects.mutateAsync({ items })
                  setDraftOrder({})
                }}>
                {reorderProjects.isPending ? "Saving…" : "Save order"}
              </Button>
            </div>

            {draftHasDuplicates ? (
              <div className="text-sm text-destructive">
                Duplicate order indexes detected. Each project must have a unique order.
              </div>
            ) : null}

            {orderedProjects.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 rounded-md border p-3">
                <div className="min-w-0">
                  <Link className="font-medium hover:underline" to={`${p.slug}`}>
                    {p.title}
                  </Link>
                  <div className="mt-1 text-xs text-muted-foreground">
                    <span className="font-mono">{p.slug}</span>
                    <span className="mx-2">•</span>
                    <span>{p.status}</span>
                    <span className="mx-2">•</span>
                    <span>{p.type}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Order</span>
                    <Input
                      className="w-20"
                      type="number"
                      value={
                        typeof draftOrder[p.id] === "number"
                          ? draftOrder[p.id]
                          : (p.orderIndex ?? 0)
                      }
                      onChange={(e) => {
                        const next = Number(e.target.value)
                        if (!Number.isFinite(next)) return
                        setDraftOrder((prev) => ({ ...prev, [p.id]: next }))
                      }}
                    />
                  </div>

                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={deleteProject.isPending}
                    onClick={async () => {
                      const ok = window.confirm(`Delete “${p.title}”?`)
                      if (!ok) return
                      await deleteProject.mutateAsync({ id: p.id })
                    }}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}

            {projects.length === 0 ? (
              <div className="text-sm text-muted-foreground">No projects yet.</div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
