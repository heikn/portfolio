import { useParams, Link } from "react-router-dom"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Github, ExternalLink } from "lucide-react"
import { useProject } from "@/lib/hooks/useProject"
import { getProjectGalleryImages, getProjectTagNames } from "@/lib/projectSelectors"

function statusBadgeClasses(status?: "live" | "dev" | "archived") {
  switch (status) {
    case "live":
      return "bg-emerald-500/15 text-emerald-700"
    case "dev":
      return "bg-amber-500/15 text-amber-700"
    case "archived":
      return "bg-slate-500/15 text-slate-700"
    default:
      return "bg-secondary text-secondary-foreground"
  }
}

export default function ProjectView() {
  const { projectId } = useParams<{ projectId: string }>()
  const { data: project, isLoading, isError, error } = useProject(projectId)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [projectId])

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-muted-foreground">Loading project…</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center max-w-xl">
          <h1 className="text-4xl font-bold mb-4">Couldn’t load project</h1>
          <p className="text-muted-foreground mb-6">
            {error instanceof Error ? error.message : "Please try again later."}
          </p>
          <Link to="/projects">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <Link to="/projects">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Back Button */}
        <Link to="/projects" className="inline-block mb-8">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>

        {/* Project Header */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold">{project.title}</h1>
            {project.status ? (
              <span
                className={`px-2 py-1 rounded-md text-xs font-medium leading-none ${statusBadgeClasses(project.status)}`}
              >
                {project.status}
              </span>
            ) : null}
          </div>
          <p className="text-xl text-muted-foreground mb-6">
            {project.description ?? project.shortDescription ?? ""}
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button>
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                </Button>
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Live Demo
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Project Images */}
        <div className="mb-12 space-y-6">
          {getProjectGalleryImages(project).map((img, index) => (
            <Card key={index} className="overflow-hidden">
              <img
                src={img.image.url}
                alt={img.altText ?? `${project.title} screenshot ${index + 1}`}
                className="w-full h-auto"
              />
            </Card>
          ))}
        </div>

        {/* Project Details Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Technologies */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {(project.technologies ?? getProjectTagNames(project)).map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Key Features</h2>
              <ul className="space-y-2">
                {((project.keyFeatures ?? project.features) ?? []).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-primary">•</span>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Interested in this project?</h2>
            <p className="text-muted-foreground mb-6">
              {project.githubUrl 
                ? "Feel free to check out the code or reach out if you have any questions."
                : "Feel free to reach out if you have any questions about this project."}
            </p>
            <div className="flex gap-4 justify-center">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Button>
                    <Github className="mr-2 h-4 w-4" />
                    View Source Code
                  </Button>
                </a>
              )}
              <Link to="/projects">
                <Button variant="outline">View More Projects</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
