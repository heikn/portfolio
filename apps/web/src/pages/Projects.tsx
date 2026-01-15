import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useProjects } from "@/lib/hooks/useProjects"
import type { Project } from "@/lib/types"
import { getProjectHeroImage, getProjectTagNames } from "@/lib/projectSelectors"
import { ExternalLink, Github } from "lucide-react"

function statusBadgeClasses(status?: Project["status"]) {
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

const ProjectCard = ({ project }: { project: Project }) => (
  <Card className="flex flex-col overflow-hidden w-full max-w-sm">
    {getProjectHeroImage(project)?.image?.url ? (
      <div className="aspect-video bg-muted overflow-hidden">
        <img
          src={getProjectHeroImage(project)!.image.url}
          alt={project.title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
    ) : null}
    <CardHeader className="space-y-2">
      <div className="flex items-start justify-between gap-3">
        <CardTitle>{project.title}</CardTitle>
        {project.status ? (
          <span
            className={`px-2 py-1 rounded-md text-xs font-medium leading-none ${statusBadgeClasses(project.status)}`}
          >
            {project.status}
          </span>
        ) : null}
      </div>
      <CardDescription className="line-clamp-3">
        {project.shortDescription ?? project.description ?? ""}
      </CardDescription>
    </CardHeader>
    <CardContent className="grow">
      <div className="flex flex-wrap gap-2">
        {getProjectTagNames(project).map((tag) => (
          <span 
            key={tag}
            className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
          >
            {tag}
          </span>
        ))}
      </div>
    </CardContent>
    <CardFooter className="flex gap-2">
      {project.githubUrl ? (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
          aria-label={`Open ${project.title} on GitHub`}
        >
          <Button variant="outline" size="icon">
            <Github className="h-4 w-4" />
          </Button>
        </a>
      ) : null}

      {project.externalUrl ? (
        <a
          href={project.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
          aria-label={`Open ${project.title} website`}
        >
          <Button variant="outline" size="icon">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </a>
      ) : null}

      <Link to={`/projects/${project.slug}`} className="w-full">
        <Button className="w-full">View Project</Button>
      </Link>
    </CardFooter>
  </Card>
)

export default function Projects() {
  const { data, isLoading, isError, error } = useProjects()

  const projects = data ?? []

  const workProjects = projects.filter((p) => p.type === "work")
  const personalProjects = projects.filter((p) => p.type === "personal")

  const ProjectsGrid = ({ items }: { items: Project[] }) => (
    <div
      className={
        items.length > 3
          ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "flex justify-center gap-6 flex-wrap"
      }>
      {items.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  )

  return (
    <div>
      {/* Header Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              My Projects
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A collection of my professional work and personal side projects
            </p>
          </div>

          {/* Projects list */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <p className="text-muted-foreground">Loading projects…</p>
            </div>
          ) : null}

          {isError ? (
            <div className="flex justify-center py-16">
              <Card className="w-full max-w-xl">
                <CardHeader>
                  <CardTitle>Couldn’t load projects</CardTitle>
                  <CardDescription>
                    {error instanceof Error ? error.message : "Please try again later."}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="justify-center">
                  <Link to="/contact">
                    <Button variant="outline">Contact me</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          ) : null}

          {!isLoading && !isError && projects.length === 0 ? (
            <div className="flex justify-center py-16">
              <Card className="w-full max-w-xl text-center">
                <CardHeader>
                  <CardTitle>No projects yet</CardTitle>
                  <CardDescription>
                    I’m currently updating my portfolio. Check back soon.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          ) : null}

          {!isLoading && !isError && projects.length > 0 ? (
            <div className="space-y-12">
              {workProjects.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-center space-y-1">
                    <h2 className="text-2xl font-semibold">Work</h2>
                    <p className="text-sm text-muted-foreground">Professional projects</p>
                  </div>
                  <ProjectsGrid items={workProjects} />
                </div>
              ) : null}

              {personalProjects.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-center space-y-1">
                    <h2 className="text-2xl font-semibold">Personal</h2>
                    <p className="text-sm text-muted-foreground">Side projects & experiments</p>
                  </div>
                  <ProjectsGrid items={personalProjects} />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl">Have a Project in Mind?</CardTitle>
              <CardDescription className="text-lg">
                I'm always open to discussing new projects and opportunities
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center gap-4">
              <Link to="/contact">
                <Button size="lg">Contact Me</Button>
              </Link>
              <a
                href="/Heikki_Nieminen_CV_EN.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline">Download Resume</Button>
              </a>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  )
}
