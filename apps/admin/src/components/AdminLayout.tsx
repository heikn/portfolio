import { Link, NavLink, Outlet, useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth"

const navItemBase =
  "block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-full [scrollbar-gutter:stable]">
      <div className="min-h-screen w-full flex flex-col items-center">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
          <div className="flex w-full justify-center">
            <div className="flex h-14 w-3xl items-center px-6">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <Link to="" className="font-semibold tracking-tight">
              Admin
            </Link>

            <nav className="flex items-center gap-1">
              <NavLink
                to="projects"
                className={({ isActive }) =>
                  cn(navItemBase, isActive && "bg-accent text-accent-foreground")
                }>
                Projects
              </NavLink>
              <NavLink
                to="images"
                className={({ isActive }) =>
                  cn(navItemBase, isActive && "bg-accent text-accent-foreground")
                }>
                Images
              </NavLink>
              <NavLink
                to="tags"
                className={({ isActive }) =>
                  cn(navItemBase, isActive && "bg-accent text-accent-foreground")
                }>
                Tags
              </NavLink>
            </nav>
          </div>

          <div className="flex w-32 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                logout()
                navigate("login", { replace: true })
              }}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full">
          <div className="flex w-full justify-center">
            <div className="w-3xl p-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
