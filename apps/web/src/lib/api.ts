import ky from "ky"

const baseUrl = import.meta.env.VITE_API_URL

if (!baseUrl) {
  // Fail fast in dev/build rather than making requests to "/" by accident.
  throw new Error("Missing VITE_API_URL env var")
}

export const api = ky.create({
  prefixUrl: baseUrl.replace(/\/+$/, ""),
  headers: {
    "Content-Type": "application/json",
  },
  retry: 0,
})
