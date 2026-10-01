import type { Status } from '../types'

const estilos: Record<Status, string> = {
  Aberto: 'bg-info-bg text-info-dark dark:bg-info/20 dark:text-info',
  'Em Atendimento': 'bg-warning-bg text-warning-dark dark:bg-warning/20 dark:text-warning',
  'Concluído': 'bg-success-bg text-success-dark dark:bg-success/20 dark:text-success',
}

const pontos: Record<Status, string> = {
  Aberto: 'bg-info',
  'Em Atendimento': 'bg-warning',
  'Concluído': 'bg-success',
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${estilos[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${pontos[status]}`} />
      {status}
    </span>
  )
}
