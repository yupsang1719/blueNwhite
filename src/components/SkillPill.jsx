/**
 * `color` is accepted (About.jsx still passes it) but not used for styling
 * any more — every call site already passed the same hex, so this just
 * lets the one accent token take over instead of a hardcoded colour.
 */
export default function SkillPill({ name, level = 3, icon: Icon }) {
  const percent = Math.min(Math.max(level, 1), 5) * 20

  return (
    <div className="py-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="group flex min-w-0 items-center gap-1.5">
          {Icon && (
            <span className="shrink-0 text-ed-base text-ink-muted transition-colors group-hover:text-accent">
              <Icon aria-hidden="true" />
            </span>
          )}
          <span className="truncate text-ed-sm text-ink">{name}</span>
        </span>
        <span className="shrink-0 text-ed-xs tabular-nums text-ink-muted">{level}/5</span>
      </div>
      <div className="mt-1.5 h-px w-full overflow-hidden bg-rule">
        <div className="h-full bg-accent transition-all duration-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
