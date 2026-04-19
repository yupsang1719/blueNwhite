export default function SkillPill({ name, level = 3, color = '#2563eb', icon: Icon }) {
  const percent = Math.min(Math.max(level, 1), 5) * 20

  return (
    <div className="group rounded-xl border bg-white/60 p-2.5 transition hover:shadow-sm
                    dark:border-neutral-700 dark:bg-neutral-800/50">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {Icon && (
            <span className="shrink-0 text-base text-neutral-400 dark:text-neutral-500
                             group-hover:text-[var(--skill-color)] transition-colors duration-200"
                  style={{ '--skill-color': color }}>
              <Icon />
            </span>
          )}
          <span className="truncate text-sm">{name}</span>
        </div>
        <span className="shrink-0 text-[10px] text-neutral-400">{level}/5</span>
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-700">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
