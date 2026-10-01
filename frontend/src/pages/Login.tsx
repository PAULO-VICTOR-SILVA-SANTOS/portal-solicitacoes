import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/Button'
import { ThemeToggle } from '../components/ThemeToggle'

export function Login() {
  const { entrar } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro(null)
    setCarregando(true)
    try {
      await entrar(email, senha)
      navigate('/', { replace: true })
    } catch (err: any) {
      setErro(err?.response?.data?.detail || 'Não foi possível entrar. Verifique suas credenciais.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-4 dark:bg-ink-950">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm animate-fadeIn">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-600 font-display text-2xl font-bold text-white shadow-soft">
            P
          </div>
          <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-white">
            Portal de Solicitações
          </h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            Entre com suas credenciais para continuar
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-ink-100 bg-white p-6 shadow-card dark:border-ink-800 dark:bg-ink-900"
        >
          {erro && (
            <div className="mb-4 rounded-md border border-danger/20 bg-danger-bg px-3 py-2.5 text-sm text-danger-dark dark:bg-danger/10 dark:text-danger">
              {erro}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-300">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@empresa.com"
              className="w-full rounded-md border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-900 transition-colors duration-150 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-ink-700 dark:bg-ink-800 dark:text-white"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="senha" className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-300">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              required
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-md border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-900 transition-colors duration-150 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-ink-700 dark:bg-ink-800 dark:text-white"
            />
          </div>

          <Button type="submit" loading={carregando} className="w-full">
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-ink-400">
          Acesso restrito a colaboradores autenticados.
        </p>
      </div>
    </div>
  )
}
