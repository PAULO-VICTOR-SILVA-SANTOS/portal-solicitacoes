import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ReactNode } from 'react'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { autenticado, carregando } = useAuth()

  if (carregando) {
    return (
      <div className="flex h-screen items-center justify-center bg-ink-50 dark:bg-ink-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
      </div>
    )
  }

  if (!autenticado) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
