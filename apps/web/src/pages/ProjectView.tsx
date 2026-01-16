import { useParams, Link } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
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

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const galleryImages = useMemo(() => {
    if (!project) return []
    return getProjectGalleryImages(project)
  }, [project])

  const openLightbox = (index: number) => {
    if (!galleryImages.length) return
    const safeIndex = ((index % galleryImages.length) + galleryImages.length) % galleryImages.length
    setLightboxIndex(safeIndex)
  }

  const closeLightbox = () => setLightboxIndex(null)

  const showPrev = () => {
    if (lightboxIndex === null) return
    openLightbox(lightboxIndex - 1)
  }

  const showNext = () => {
    if (lightboxIndex === null) return
    openLightbox(lightboxIndex + 1)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [projectId])

  useEffect(() => {
    if (lightboxIndex === null) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowLeft") showPrev()
      if (e.key === "ArrowRight") showNext()
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [lightboxIndex])

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
        {lightboxIndex !== null && galleryImages[lightboxIndex] ? (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Image preview"
            onClick={closeLightbox}
          >
            <div
              className="relative w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={galleryImages[lightboxIndex].image.url}
                alt={
                  galleryImages[lightboxIndex].altText ??
                  `${project.title} screenshot ${lightboxIndex + 1}`
                }
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              />

              {galleryImages.length > 1 ? (
                <>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={showPrev}
                      aria-label="Previous image"
                    >
                      Prev
                    </Button>
                  </div>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={showNext}
                      aria-label="Next image"
                    >
                      Next
                    </Button>
                  </div>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                    <div className="flex flex-col items-center gap-2">
                      <span className="rounded-md bg-black/50 text-white text-xs px-2 py-1">
                        {lightboxIndex + 1} / {galleryImages.length}
                      </span>
                      <span className="max-w-[min(85vw,48rem)] rounded-md bg-black/50 text-white text-xs px-3 py-2 text-center">
                        {galleryImages[lightboxIndex].altText ??
                          `${project.title} screenshot ${lightboxIndex + 1}`}
                      </span>
                    </div>
                  </div>
                </>
              ) : null}

              <div className="absolute top-3 right-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={closeLightbox}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        ) : null}

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
            {project.externalUrl && (
              <a href={project.externalUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit Site
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Project Images */}
        {galleryImages.length ? (
          <div className="mb-12">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold">Screenshots</h2>
              <p className="text-sm text-muted-foreground">
                A few highlights from the application
              </p>
            </div>
            <div className="mx-auto max-w-5xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryImages.map((img, index) => (
                  <button
                    key={`${img.imageId}-${img.orderIndex}`}
                    type="button"
                    className="text-left cursor-pointer"
                    onClick={() => openLightbox(index)}
                    aria-label={`Open image ${index + 1}`}
                  >
                    <Card className="overflow-hidden">
                      <div className="aspect-video bg-muted">
                        <img
                          src={img.image.url}
                          alt={img.altText ?? `${project.title} screenshot ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </Card>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

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
