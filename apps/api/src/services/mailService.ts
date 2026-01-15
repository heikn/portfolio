import nodemailer from "nodemailer"
import { HttpError } from "../lib/httpError.js"

const env = (key: string) => {
  const v = process.env[key]
  if (!v) throw new HttpError(500, `${key} is not configured`)
  return v
}

export const mailService = {
  async sendContactMessage(input: { name: string; email: string; message: string }) {
    const host = env("MAIL_HOST")
    const port = Number(env("MAIL_PORT"))
    const secure = (process.env.MAIL_SECURE || "false") === "true"
    const user = env("MAIL_USER")
    const pass = env("MAIL_PASS")
    const from = env("MAIL_FROM")
    const to = env("MAIL_TO")

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    })

    await transporter.sendMail({
      from,
      to,
      replyTo: input.email,
      subject: `Portfolio contact: ${input.name}`,
      text: `From: ${input.name} <${input.email}>\n\n${input.message}`,
    })
  },
}
