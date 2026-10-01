import { useState } from 'react'
import { Button } from './Button'
import { StatusBadge } from './StatusBadge'
import type { Solicitacao, Status } from '../types'

const proximosStatus: Record<Status, Status[]> = {
  Aberto: ['Em Atendimento'],
  'Em Atendimento': ['Concluído', 'Aberto'],
  'Concluído': [],
}

interface SolicitacaoDetailProps {
  solicitacao: Solicitacao
  onEditar: () => void
  onExcluir: () => Promise<void>
  onAlterarStatus: (status: Status) => Promise<void>
}

export function SolicitacaoDetail({
  solicitacao,
  onEditar,
  onExcluir,
  onAlterarStatus,
}: SolicitacaoDetailProps) {
  const [processando, setProcessando] = useState(false)
  const podeEditar = solicitacao.status === 'Aberto'

  async function handleStatus(status: Status) {
    setProcessando(true)
    try {
      await onAlterarStatus(status)
    } finally {
      setProcessando(false)
    }
  }

  async function handleExcluir() {
    if (!confirm('Tem certeza que deseja excluir esta solicitação?')) return
    setProcessando(true)
    try {
      await onExcluir()
    } finally {
      setProcessando(false)
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-xs text-ink-400">{solicitacao.codigo}</span>
        <StatusBadge status={solicitacao.status} />
      </div>

      <h3 className="font-display text-lg font-semibold text-ink-900 dark:text-white">
        {solicitacao.titulo}
      </h3>

      <div className="mt-2 flex flex-wrap gap-2">
        <span className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-600 dark:bg-ink-800 dark:text-ink-300">
          {solicitacao.categoria}
        </span>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink-600 dark:text-ink-300">
        {solicitacao.descricao}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-ink-100 pt-4 text-sm dark:border-ink-800">
        <div>
          <dt className="text-ink-400">Solicitante</dt>
          <dd className="mt-0.5 font-medium text-ink-800 dark:text-ink-200">{solicitacao.solicitante.nome}</dd>
        </div>
        <div>
          <dt className="text-ink-400">Data de abertura</dt>
          <dd className="mt-0.5 font-medium text-ink-800 dark:text-ink-200">
            {new Date(solicitacao.criado_em).toLocaleString('pt-BR')}
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-ink-100 pt-5 dark:border-ink-800">
        {proximosStatus[solicitacao.status].map((status) => (
          <Button key={status} size="sm" variant="secondary" disabled={processando} onClick={() => handleStatus(status)}>
            Mover para "{status}"
          </Button>
        ))}

        <div className="ml-auto flex gap-2">
          {podeEditar && (
            <>
              <Button size="sm" variant="ghost" onClick={onEditar} disabled={processando}>
                Editar
              </Button>
              <Button size="sm" variant="danger" onClick={handleExcluir} disabled={processando}>
                Excluir
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
