import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Usuario } from '../types'
import { login as loginService, logout as logoutService } from '../services/auth'

interface AuthContextValue {
  usuario: Usuario | null
  carregando: boolean
  autenticado: boolean
  entrar: (email: string, senha: string) => Promise<void>
  sair: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('usuario')
    const token = localStorage.getItem('token')
    if (stored && token) {
      setUsuario(JSON.parse(stored))
    }
    setCarregando(false)
  }, [])

  async function entrar(email: string, senha: string) {
    const resposta = await loginService(email, senha)
    localStorage.setItem('token', resposta.access_token)
    localStorage.setItem('usuario', JSON.stringify(resposta.usuario))
    setUsuario(resposta.usuario)
  }

  async function sair() {
    await logoutService()
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, autenticado: !!usuario, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  return context
}
