import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCreateProject, useDeleteProject, useProjects } from "@/lib/hooks/useProjects"

export default function Projects() {
  const navigate = useNavigate()
  const { data, isLoading, error } = useProjects()

  const createProject = useCreateProject()
  const deleteProject = useDeleteProject()

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading…</div>
  if (error) return <div className="text-sm text-destructive">{error.message}</div>

  const projects = data ?? []

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
          <div className="space-y-2">
            {projects.map((p) => (
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
