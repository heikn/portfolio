import { Outlet } from "react-router-dom"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function Layout({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
