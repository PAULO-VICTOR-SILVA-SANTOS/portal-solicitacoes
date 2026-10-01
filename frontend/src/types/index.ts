export type Categoria = 'TI' | 'RH' | 'Compras' | 'Financeiro' | 'Infraestrutura'

export type Status = 'Aberto' | 'Em Atendimento' | 'Concluído'

export interface Usuario {
  id: number
  nome: string
  email: string
  ativo: boolean
}

export interface Solicitacao {
  id: number
  codigo: string
  titulo: string
  descricao: string
  categoria: Categoria
  status: Status
  solicitante: Usuario
  criado_em: string
  atualizado_em: string
}

export interface SolicitacaoListItem {
  id: number
  codigo: string
  titulo: string
  categoria: Categoria
  status: Status
  solicitante: Usuario
  criado_em: string
}

export interface DashboardData {
  total: number
  abertas: number
  em_atendimento: number
  concluidas: number
}

export interface SolicitacaoFiltros {
  categoria?: Categoria
  status?: Status
  texto?: string
  data_inicio?: string
  data_fim?: string
}

export const CATEGORIAS: Categoria[] = ['TI', 'RH', 'Compras', 'Financeiro', 'Infraestrutura']
export const STATUSES: Status[] = ['Aberto', 'Em Atendimento', 'Concluído']
