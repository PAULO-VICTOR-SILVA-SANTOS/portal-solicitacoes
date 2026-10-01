import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { StatCard } from "../components/StatCard";
import { StatusBadge } from "../components/StatusBadge";
import { obterDashboard, listarSolicitacoes } from "../services/solicitacoes";
import type { DashboardData, SolicitacaoListItem } from "../types";

export function Dashboard() {
  const [dados, setDados] = useState<DashboardData | null>(null);
  const [recentes, setRecentes] = useState<SolicitacaoListItem[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        const [dashboard, lista] = await Promise.all([
          obterDashboard(),
          listarSolicitacoes({}),
        ]);
        setDados(dashboard);
        setRecentes(lista.slice(0, 5));
      } catch {
        setErro("Não foi possível carregar os dados do dashboard.");
      }
    }
    carregar();
  }, []);

  return (
    <div className="mx-auto max-w-6xl animate-fadeIn">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            Visão geral das solicitações internas
          </p>
        </div>
        <Link
          to="/solicitacoes"
          className="self-start rounded-md bg-brand-600 px-4 py-2.5 text-sm font-medium text-white shadow-soft transition-colors duration-150 hover:bg-brand-700 sm:self-auto"
        >
          Nova solicitação
        </Link>
      </div>

      {erro && (
        <div className="mb-6 rounded-md border border-danger/20 bg-danger-bg px-4 py-3 text-sm text-danger-dark dark:bg-danger/10 dark:text-danger">
          {erro}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total de solicitações"
          value={dados?.total ?? null}
          accent="brand"
          icon={TotalIcon}
        />
        <StatCard
          label="Abertas"
          value={dados?.abertas ?? null}
          accent="info"
          icon={OpenIcon}
        />
        <StatCard
          label="Em atendimento"
          value={dados?.em_atendimento ?? null}
          accent="warning"
          icon={ClockIcon}
        />
        <StatCard
          label="Concluídas"
          value={dados?.concluidas ?? null}
          accent="success"
          icon={CheckIcon}
        />
      </div>

      <div className="mt-8 rounded-lg border border-ink-100 bg-white shadow-card dark:border-ink-800 dark:bg-ink-900">
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4 dark:border-ink-800">
          <h2 className="font-display text-base font-semibold text-ink-900 dark:text-white">
            Solicitações recentes
          </h2>
          <Link
            to="/solicitacoes"
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            Ver todas
          </Link>
        </div>

        {recentes === null ? (
          <div className="space-y-3 p-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-12 w-full rounded-md" />
            ))}
          </div>
        ) : recentes.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="divide-y divide-ink-100 dark:divide-ink-800">
            {recentes.map((s) => (
              <Link
                key={s.id}
                to={`/solicitacoes?id=${s.id}`}
                className="flex items-center justify-between gap-4 px-5 py-4 transition-colors duration-150 hover:bg-ink-50 dark:hover:bg-ink-800/50"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-ink-400">
                      {s.codigo}
                    </span>
                    <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-medium text-ink-600 dark:bg-ink-800 dark:text-ink-300">
                      {s.categoria}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-sm font-medium text-ink-900 dark:text-white">
                    {s.titulo}
                  </p>
                </div>
                <StatusBadge status={s.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-ink-100 text-ink-400 dark:bg-ink-800">
        <ListEmptyIcon className="h-6 w-6" />
      </div>
      <p className="text-sm font-medium text-ink-700 dark:text-ink-300">
        Nenhuma solicitação ainda
      </p>
      <p className="mt-1 text-sm text-ink-400">
        Crie a primeira solicitação para começar.
      </p>
      <Link
        to="/solicitacoes"
        className="mt-4 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-brand-700"
      >
        Nova solicitação
      </Link>
    </div>
  );
}

function TotalIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}
function OpenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-8.25 3.75h.008v.008h-.008v-.008z"
      />
    </svg>
  );
}
function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
function ListEmptyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 13h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}
