import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Mail, Linkedin, Send } from "lucide-react"
import { useSendContactMessage } from "@/lib/hooks/useSendContactMessage"

const EMAIL = "heikki.nieminen@example.com"
const LINKEDIN_URL = "https://www.linkedin.com/in/heikki-nieminen/"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const sendMessage = useSendContactMessage()

  const status: "idle" | "sending" | "success" | "error" = sendMessage.isPending
    ? "sending"
    : sendMessage.isSuccess
      ? "success"
      : sendMessage.isError
        ? "error"
        : "idle"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await sendMessage.mutateAsync(formData, {
      onSuccess: () => {
        setFormData({ name: "", email: "", message: "" })

        window.setTimeout(() => {
          sendMessage.reset()
        }, 5000)
      },
    })
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Let's Talk</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether it’s a job opportunity, a project, or just a quick question,
            I’m happy to hear from you.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Quick Message Form */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Message</CardTitle>
              <CardDescription>
                Send me a message directly and I'll get back to you as soon as
                possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {status === "success" ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold">Thanks!</h3>
                  <p className="text-muted-foreground">
                    I’ll get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={status === "sending"}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={status === "sending"}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Tell me what you have in mind…"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      disabled={status === "sending"}
                      className="flex min-h-30 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={status === "sending"}>
                    <Send className="mr-2 h-4 w-4" />
                    {status === "sending" ? "Sending…" : "Send Message"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Right: Contact Methods */}
          <div className="space-y-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Email</CardTitle>
                    <CardDescription>Send me an email directly</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-primary hover:underline font-medium"
                >
                  {EMAIL}
                </a>
                <div className="mt-4">
                  <a href={`mailto:${EMAIL}`}>
                    <Button className="w-full">
                      <Mail className="mr-2 h-4 w-4" />
                      Open Email Client
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Linkedin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>LinkedIn</CardTitle>
                    <CardDescription>
                      Connect with me professionally
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Let's connect on LinkedIn to discuss opportunities and
                  professional networking.
                </p>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full">
                    <Linkedin className="mr-2 h-4 w-4" />
                    View LinkedIn Profile
                  </Button>
                </a>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Response Time:</strong> I
                  typically respond within 24-48 hours during weekdays.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
