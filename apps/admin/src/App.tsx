import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import AdminLayout from "@/components/AdminLayout"
import ProtectedRoute from "@/components/ProtectedRoute"
import Login from "@/pages/Login"
import ProjectEdit from "@/pages/ProjectEdit"
import Projects from "@/pages/Projects"
import Images from "@/pages/Images"
import Tags from "@/pages/Tags"
import { AuthProvider, useAuth } from "@/lib/auth"

function IndexRedirect() {
  const { isAuthenticated } = useAuth()
  return <Navigate to={isAuthenticated ? "/projects" : "/login"} replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/admin">
        <Routes>
          <Route path="/" element={<IndexRedirect />} />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectEdit />} />
              <Route path="/images" element={<Images />} />
              <Route path="/tags" element={<Tags />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
