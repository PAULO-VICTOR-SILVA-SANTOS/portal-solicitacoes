import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { StatusBadge } from "../components/StatusBadge";
import { SolicitacaoForm } from "../components/SolicitacaoForm";
import { SolicitacaoDetail } from "../components/SolicitacaoDetail";
import {
  alterarStatus,
  criarSolicitacao,
  editarSolicitacao,
  excluirSolicitacao,
  listarSolicitacoes,
  obterSolicitacao,
} from "../services/solicitacoes";
import {
  CATEGORIAS,
  STATUSES,
  type Categoria,
  type Solicitacao,
  type SolicitacaoListItem,
  type Status,
} from "../types";

export function Solicitacoes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [lista, setLista] = useState<SolicitacaoListItem[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState<Categoria | "">("");
  const [status, setStatus] = useState<Status | "">("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const [modalCriar, setModalCriar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [detalheSelecionado, setDetalheSelecionado] =
    useState<Solicitacao | null>(null);

  const carregar = useCallback(async () => {
    try {
      const dados = await listarSolicitacoes({
        texto: texto || undefined,
        categoria: (categoria as Categoria) || undefined,
        status: (status as Status) || undefined,
        data_inicio: dataInicio || undefined,
        data_fim: dataFim || undefined,
      });
      setLista(dados);
    } catch {
      setErro("Não foi possível carregar as solicitações.");
    }
  }, [texto, categoria, status, dataInicio, dataFim]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      abrirDetalhe(Number(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function abrirDetalhe(id: number) {
    try {
      const dados = await obterSolicitacao(id);
      setDetalheSelecionado(dados);
    } catch {
      setErro("Não foi possível carregar os detalhes da solicitação.");
    }
  }

  function fecharDetalhe() {
    setDetalheSelecionado(null);
    if (searchParams.get("id")) {
      searchParams.delete("id");
      setSearchParams(searchParams, { replace: true });
    }
  }

  async function handleCriar(dados: {
    titulo: string;
    descricao: string;
    categoria: Categoria;
  }) {
    await criarSolicitacao(dados);
    setModalCriar(false);
    await carregar();
  }

  async function handleEditar(dados: {
    titulo: string;
    descricao: string;
    categoria: Categoria;
  }) {
    if (!detalheSelecionado) return;
    const atualizado = await editarSolicitacao(detalheSelecionado.id, dados);
    setDetalheSelecionado(atualizado);
    setModalEditar(false);
    await carregar();
  }

  async function handleExcluir() {
    if (!detalheSelecionado) return;
    await excluirSolicitacao(detalheSelecionado.id);
    fecharDetalhe();
    await carregar();
  }

  async function handleStatus(novoStatus: Status) {
    if (!detalheSelecionado) return;
    const atualizado = await alterarStatus(detalheSelecionado.id, novoStatus);
    setDetalheSelecionado(atualizado);
    await carregar();
  }

  function limparFiltros() {
    setTexto("");
    setCategoria("");
    setStatus("");
    setDataInicio("");
    setDataFim("");
  }

  const filtrosAtivos = !!(
    texto ||
    categoria ||
    status ||
    dataInicio ||
    dataFim
  );

  return (
    <div className="mx-auto max-w-6xl animate-fadeIn">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-white">
            Solicitações
          </h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            Gerencie e acompanhe todas as demandas internas
          </p>
        </div>
        <Button
          onClick={() => setModalCriar(true)}
          className="self-start sm:self-auto"
        >
          + Nova solicitação
        </Button>
      </div>

      {erro && (
        <div className="mb-6 rounded-md border border-danger/20 bg-danger-bg px-4 py-3 text-sm text-danger-dark dark:bg-danger/10 dark:text-danger">
          {erro}
        </div>
      )}

      <div className="mb-5 rounded-lg border border-ink-100 bg-white p-4 shadow-card dark:border-ink-800 dark:bg-ink-900">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Buscar por título..."
            className="rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-ink-700 dark:bg-ink-800 dark:text-white"
          />
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value as Categoria | "")}
            className="rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-ink-700 dark:bg-ink-800 dark:text-white"
          >
            <option value="">Todas as categorias</option>
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Status | "")}
            className="rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-ink-700 dark:bg-ink-800 dark:text-white"
          >
            <option value="">Todos os status</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-ink-700 dark:bg-ink-800 dark:text-white"
          />
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-ink-700 dark:bg-ink-800 dark:text-white"
          />
        </div>
        {filtrosAtivos && (
          <button
            onClick={limparFiltros}
            className="mt-3 text-xs font-medium text-brand-600 hover:text-brand-700"
          >
            Limpar filtros
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-ink-100 bg-white shadow-card dark:border-ink-800 dark:bg-ink-900">
        {lista === null ? (
          <div className="space-y-3 p-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton h-14 w-full rounded-md" />
            ))}
          </div>
        ) : lista.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <p className="text-sm font-medium text-ink-700 dark:text-ink-300">
              Nenhuma solicitação encontrada
            </p>
            <p className="mt-1 text-sm text-ink-400">
              Ajuste os filtros ou crie uma nova solicitação.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile (< sm): lista de cards — evita tabela de 6 colunas cortada/sem indicação de scroll em telas estreitas */}
            <div className="divide-y divide-ink-100 dark:divide-ink-800 sm:hidden">
              {lista.map((s) => (
                <div
                  key={s.id}
                  onClick={() => abrirDetalhe(s.id)}
                  className="cursor-pointer space-y-2 px-4 py-3.5 transition-colors duration-150 hover:bg-ink-50 dark:hover:bg-ink-800/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="font-mono text-xs text-ink-400">
                        {s.codigo}
                      </span>
                      <p className="mt-0.5 truncate text-sm font-medium text-ink-900 dark:text-white">
                        {s.titulo}
                      </p>
                    </div>
                    <StatusBadge status={s.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-500 dark:text-ink-400">
                    <span className="rounded-full bg-ink-100 px-2 py-0.5 font-medium text-ink-600 dark:bg-ink-800 dark:text-ink-300">
                      {s.categoria}
                    </span>
                    <span>{s.solicitante.nome}</span>
                    <span>
                      {new Date(s.criado_em).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tablet/desktop (>= sm): tabela completa */}
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400 dark:border-ink-800">
                    <th className="px-5 py-3 font-medium">Código</th>
                    <th className="px-5 py-3 font-medium">Título</th>
                    <th className="px-5 py-3 font-medium">Categoria</th>
                    <th className="px-5 py-3 font-medium">Solicitante</th>
                    <th className="px-5 py-3 font-medium">Abertura</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
                  {lista.map((s) => (
                    <tr
                      key={s.id}
                      onClick={() => abrirDetalhe(s.id)}
                      className="cursor-pointer transition-colors duration-150 hover:bg-ink-50 dark:hover:bg-ink-800/50"
                    >
                      <td className="px-5 py-3 font-mono text-xs text-ink-400">
                        {s.codigo}
                      </td>
                      <td className="max-w-xs truncate px-5 py-3 font-medium text-ink-900 dark:text-white">
                        {s.titulo}
                      </td>
                      <td className="px-5 py-3 text-ink-600 dark:text-ink-300">
                        {s.categoria}
                      </td>
                      <td className="px-5 py-3 text-ink-600 dark:text-ink-300">
                        {s.solicitante.nome}
                      </td>
                      <td className="px-5 py-3 text-ink-500 dark:text-ink-400">
                        {new Date(s.criado_em).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={s.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <Modal
        open={modalCriar}
        onClose={() => setModalCriar(false)}
        title="Nova solicitação"
      >
        <SolicitacaoForm
          onSubmit={handleCriar}
          onCancel={() => setModalCriar(false)}
        />
      </Modal>

      <Modal
        open={modalEditar}
        onClose={() => setModalEditar(false)}
        title="Editar solicitação"
      >
        {detalheSelecionado && (
          <SolicitacaoForm
            inicial={detalheSelecionado}
            onSubmit={handleEditar}
            onCancel={() => setModalEditar(false)}
          />
        )}
      </Modal>

      <Modal
        open={!!detalheSelecionado && !modalEditar}
        onClose={fecharDetalhe}
        title="Detalhes da solicitação"
      >
        {detalheSelecionado && (
          <SolicitacaoDetail
            solicitacao={detalheSelecionado}
            onEditar={() => setModalEditar(true)}
            onExcluir={handleExcluir}
            onAlterarStatus={handleStatus}
          />
        )}
      </Modal>
    </div>
  );
}
