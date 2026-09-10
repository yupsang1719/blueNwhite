const TONES = {
  neutral: 'border-neutral-200 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400',
  live:    'border-emerald-200 text-emerald-700 dark:border-emerald-900 dark:text-emerald-400',
  accent:  'border-primary-200 text-primary-700 dark:border-primary-900 dark:text-primary-400',
}

const DOTS = {
  neutral: 'bg-neutral-400',
  live:    'bg-emerald-500',
  accent:  'bg-primary-500',
}

export default function StatusBadge({ label, tone = 'neutral', pulse = false }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${DOTS[tone]} ${pulse ? 'animate-pulse' : ''}`} />
      {label}
    </span>
  )
}
