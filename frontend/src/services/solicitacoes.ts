import { api } from './api'
import type {
  DashboardData,
  Solicitacao,
  SolicitacaoFiltros,
  SolicitacaoListItem,
  Status,
} from '../types'

export interface SolicitacaoPayload {
  titulo: string
  descricao: string
  categoria: string
}

export async function listarSolicitacoes(filtros: SolicitacaoFiltros): Promise<SolicitacaoListItem[]> {
  const params = Object.fromEntries(
    Object.entries(filtros).filter(([, v]) => v !== undefined && v !== '')
  )
  const { data } = await api.get<SolicitacaoListItem[]>('/api/solicitacoes', { params })
  return data
}

export async function obterDashboard(): Promise<DashboardData> {
  const { data } = await api.get<DashboardData>('/api/solicitacoes/dashboard')
  return data
}

export async function obterSolicitacao(id: number): Promise<Solicitacao> {
  const { data } = await api.get<Solicitacao>(`/api/solicitacoes/${id}`)
  return data
}

export async function criarSolicitacao(payload: SolicitacaoPayload): Promise<Solicitacao> {
  const { data } = await api.post<Solicitacao>('/api/solicitacoes', payload)
  return data
}

export async function editarSolicitacao(
  id: number,
  payload: Partial<SolicitacaoPayload>
): Promise<Solicitacao> {
  const { data } = await api.put<Solicitacao>(`/api/solicitacoes/${id}`, payload)
  return data
}

export async function excluirSolicitacao(id: number): Promise<void> {
  await api.delete(`/api/solicitacoes/${id}`)
}

export async function alterarStatus(id: number, status: Status): Promise<Solicitacao> {
  const { data } = await api.patch<Solicitacao>(`/api/solicitacoes/${id}/status`, { status })
  return data
}
