import ky from "ky"

const baseUrl = import.meta.env.VITE_API_URL

if (!baseUrl) {
  throw new Error("Missing VITE_API_URL env var")
}

const TOKEN_KEY = "admin_token"

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export const api = ky.create({
  prefixUrl: baseUrl.replace(/\/+$/, ""),
  hooks: {
    beforeRequest: [
      (request) => {
        const token = getAuthToken()
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`)
        }
      },
    ],
  },
  retry: 0,
})
