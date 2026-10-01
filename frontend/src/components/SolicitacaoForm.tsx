import { FormEvent, useState } from 'react'
import { Button } from './Button'
import { CATEGORIAS, type Categoria, type Solicitacao } from '../types'

interface SolicitacaoFormProps {
  inicial?: Solicitacao
  onSubmit: (dados: { titulo: string; descricao: string; categoria: Categoria }) => Promise<void>
  onCancel: () => void
}

export function SolicitacaoForm({ inicial, onSubmit, onCancel }: SolicitacaoFormProps) {
  const [titulo, setTitulo] = useState(inicial?.titulo ?? '')
  const [descricao, setDescricao] = useState(inicial?.descricao ?? '')
  const [categoria, setCategoria] = useState<Categoria>(inicial?.categoria ?? 'TI')
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro(null)
    setEnviando(true)
    try {
      await onSubmit({ titulo, descricao, categoria })
    } catch (err: any) {
      setErro(err?.response?.data?.detail || 'Não foi possível salvar a solicitação.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {erro && (
        <div className="mb-4 rounded-md border border-danger/20 bg-danger-bg px-3 py-2.5 text-sm text-danger-dark dark:bg-danger/10 dark:text-danger">
          {erro}
        </div>
      )}

      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-300">Título</label>
        <input
          required
          minLength={3}
          maxLength={150}
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ex.: Solicitação de troca de monitor"
          className="w-full rounded-md border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-900 transition-colors duration-150 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-ink-700 dark:bg-ink-800 dark:text-white"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-300">Categoria</label>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value as Categoria)}
          className="w-full rounded-md border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-900 transition-colors duration-150 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-ink-700 dark:bg-ink-800 dark:text-white"
        >
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-300">Descrição</label>
        <textarea
          required
          minLength={5}
          rows={4}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descreva a demanda com o máximo de detalhes possível"
          className="w-full resize-none rounded-md border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-900 transition-colors duration-150 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-ink-700 dark:bg-ink-800 dark:text-white"
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={enviando}>
          {inicial ? 'Salvar alterações' : 'Criar solicitação'}
        </Button>
      </div>
    </form>
  )
}
