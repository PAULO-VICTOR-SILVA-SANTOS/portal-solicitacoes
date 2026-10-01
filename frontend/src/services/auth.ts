import { api } from './api'
import type { Usuario } from '../types'

interface LoginResponse {
  access_token: string
  token_type: string
  usuario: Usuario
}

export async function login(email: string, senha: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/api/auth/login', { email, senha })
  return data
}

export async function logout(): Promise<void> {
  try {
    await api.post('/api/auth/logout')
  } finally {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
  }
}
