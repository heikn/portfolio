import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import selfie from "@/assets/selfie.jpg";
import { Link } from "react-router-dom";

const aboutCards = [
  {
    id: 0,
    title: "How I work",
    description: "End-to-End Development",
    content:
      "I enjoy building things end to end. I like owning a feature from idea to production, covering database design, backend logic, and the final user interface. I focus on building systems that are clear, maintainable, and easy to extend as they grow.",
  },
  {
    id: 1,
    title: "What I build",
    description: "Full-Stack Products",
    content:
      "I build software that solves concrete problems. From APIs and databases to frontends and dashboards, I focus on systems that help people do their work better and make complex things easier to understand.",
  },
  {
    id: 2,
    title: "What I value",
    description: "Building Real Products",
    content:
      "I value clean architecture, good developer experience, and software that solves real problems. I like working in environments where people communicate openly, care about quality, and take responsibility for what they build.",
  },
  {
    id: 3,
    title: "What I am looking for",
    description: "Opportunities & Collaboration",
    content:
      "I am looking for opportunities to work on meaningful products and larger systems. I want to grow as a developer, learn new technologies, and contribute to a team that builds things that actually matter.",
  },
];

const techCards = [
  {
    id: 4,
    title: "Frontend",
    description: "Modern UI Development",
    content:
      "Enthusiast in React, TypeScript, and modern UI libraries. Building responsive and accessible user interfaces.",
  },
  {
    id: 5,
    title: "Backend",
    description: "Scalable Architecture",
    content:
      "Experienced with Node.js, databases, and API design. Creating robust server-side solutions.",
  },
  {
    id: 6,
    title: "DevOps",
    description: "Deployment & CI/CD",
    content:
      "Proficient in Docker and cloud-based Linux environments. Managing deployments, server configuration, and automated update workflows.",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                Heikki Nieminen
              </h1>
              <h2 className="text-2xl text-muted-foreground">
                Full-Stack Developer
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl">
                I'm a full-stack developer who enjoys turning ideas into real,
                working products from database design to backend logic and the final user interface. I'm driven by
                building products that solve real problems for real people.
              </p>
              <div className="flex gap-4 justify-center md:justify-start">
                <Link to="/projects">
                  <Button size="lg">View My Work</Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline">
                    Contact Me
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-muted overflow-hidden">
                <img
                  src={selfie}
                  alt="Heikki Nieminen"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12">About Me</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {aboutCards.map((card) => (
              <Card key={card.id}>
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {card.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <h3 className="text-3xl font-bold text-center mt-12">
            Technologies I Work With
          </h3>
          <h4 className="text-center text-muted-foreground mt-4 mb-8">
            A selection of tools and technologies I frequently use in my
            projects.
          </h4>
          <div className="grid md:grid-cols-3 gap-6">
            {techCards.map((card) => (
              <Card key={card.id}>
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {card.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl">
                Let’s build something real
              </CardTitle>
              <CardDescription className="text-lg">
                I enjoy building tools and products that people actually use. If
                you have an idea or project in mind, feel free to reach out!
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <div className="flex flex-col gap-4 w-full md:w-auto">
                <Link
                  to="/projects"
                  className="text-sm font-medium transition-colors hover:text-primary">
                  <Button size="lg" className="w-full">
                    Projects
                  </Button>
                </Link>
                <div className="flex flex-row items-center justify-center gap-4">
                  <Link to="/contact">
                    <Button size="lg" variant="outline">
                      Contact Me
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline">
                    Resume
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}
