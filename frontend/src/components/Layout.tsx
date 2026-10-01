import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { to: "/", label: "Dashboard", icon: DashboardIcon },
  { to: "/solicitacoes", label: "Solicitações", icon: ListIcon },
];

export function Layout() {
  const { usuario, sair } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await sair();
    navigate("/login", { replace: true });
  }

  const iniciais = usuario?.nome
    ?.split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-ink-50/60 dark:bg-ink-950">
      <aside className="hidden w-64 flex-col border-r border-ink-100 bg-white px-4 py-6 dark:border-ink-800 dark:bg-ink-900 md:flex">
        <div className="mb-8 flex items-center gap-2.5 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-600 font-display text-lg font-bold text-white">
            P
          </div>
          <div>
            <p className="font-display text-[15px] font-semibold leading-tight text-ink-900 dark:text-white">
              Portal Interno
            </p>
            <p className="text-xs text-ink-400">Solicitações</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
                    : "text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
                }`
              }
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex items-center gap-3 rounded-md border border-ink-100 p-3 dark:border-ink-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
            {iniciais}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink-900 dark:text-white">
              {usuario?.nome}
            </p>
            <p className="truncate text-xs text-ink-400">{usuario?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Sair"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-ink-400 transition-colors duration-150 hover:bg-ink-100 hover:text-danger dark:hover:bg-ink-700"
          >
            <LogoutIcon className="h-[18px] w-[18px]" />
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-ink-100 bg-white px-4 py-3 dark:border-ink-800 dark:bg-ink-900 md:px-8">
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 font-display text-sm font-bold text-white">
              P
            </div>
            <span className="font-display text-sm font-semibold">
              Portal Interno
            </span>
          </div>
          <div className="hidden md:block" />
          <ThemeToggle />
        </header>

        <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>

        <nav className="flex items-center justify-around border-t border-ink-100 bg-white py-2 dark:border-ink-800 dark:bg-ink-900 md:hidden">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-1.5 text-xs font-medium ${
                  isActive ? "text-brand-600" : "text-ink-400"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

function DashboardIcon(props: React.SVGProps<SVGSVGElement>) {
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
        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
      />
    </svg>
  );
}

function ListIcon(props: React.SVGProps<SVGSVGElement>) {
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
        d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      />
    </svg>
  );
}

function LogoutIcon(props: React.SVGProps<SVGSVGElement>) {
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
        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H3"
      />
    </svg>
  );
}
