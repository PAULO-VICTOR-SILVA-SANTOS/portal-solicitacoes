interface StatCardProps {
  label: string
  value: number | null
  accent: 'brand' | 'info' | 'warning' | 'success'
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const accentClasses: Record<string, string> = {
  brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
  info: 'bg-info-bg text-info dark:bg-info/15 dark:text-info',
  warning: 'bg-warning-bg text-warning dark:bg-warning/15 dark:text-warning',
  success: 'bg-success-bg text-success dark:bg-success/15 dark:text-success',
}

export function StatCard({ label, value, accent, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-lg border border-ink-100 bg-white p-5 shadow-card transition-shadow duration-150 hover:shadow-hover dark:border-ink-800 dark:bg-ink-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-ink-500 dark:text-ink-400">{label}</p>
          {value === null ? (
            <div className="skeleton mt-2 h-8 w-16 rounded-md" />
          ) : (
            <p className="mt-1 font-display text-3xl font-semibold text-ink-900 dark:text-white">
              {value}
            </p>
          )}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-md ${accentClasses[accent]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
