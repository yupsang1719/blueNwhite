import { FiStar, FiGitBranch, FiClock, FiAlertCircle, FiGithub } from 'react-icons/fi'
import { timeAgo } from '../shared/github'

export default function GithubStats({ stats, loading, htmlUrl }) {
  if (loading) {
    return (
      <div className="animate-pulse border-t border-rule pt-4">
        <div className="mb-3 h-3 w-24 rounded bg-paper-raised" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-paper-raised" />
          <div className="h-3 w-3/4 rounded bg-paper-raised" />
        </div>
      </div>
    )
  }

  // Not configured or fetch failed — show a plain GitHub link if we have one
  if (!stats) {
    if (!htmlUrl) return null
    return (
      <div className="border-t border-rule pt-4">
        <h3 className="mb-3 text-ed-xs uppercase tracking-ed-wide text-ink-muted">GitHub</h3>
        <a
          href={htmlUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-ed-sm text-ink-muted transition-colors hover:text-accent"
        >
          <FiGithub size={14} aria-hidden="true" /> View repository
        </a>
      </div>
    )
  }

  return (
    <div className="border-t border-rule pt-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-ed-xs uppercase tracking-ed-wide text-ink-muted">GitHub</h3>
        {htmlUrl && (
          <a
            href={htmlUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Open repository on GitHub"
            className="text-ink-muted transition-colors hover:text-accent"
          >
            <FiGithub size={14} />
          </a>
        )}
      </div>

      {(stats.stars > 0 || stats.forks > 0 || stats.openIssues > 0) && (
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-ed-sm text-ink-muted">
          {stats.stars > 0 && <Stat icon={<FiStar size={13} aria-hidden="true" />} value={stats.stars} label="stars" />}
          {stats.forks > 0 && <Stat icon={<FiGitBranch size={13} aria-hidden="true" />} value={stats.forks} label="forks" />}
          {stats.openIssues > 0 && <Stat icon={<FiAlertCircle size={13} aria-hidden="true" />} value={stats.openIssues} label="issues" />}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3 text-ed-xs text-ink-muted">
        {stats.language && (
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-ink-muted" aria-hidden="true" />
            {stats.language}
          </span>
        )}
        {stats.pushedAt && (
          <span className="flex items-center gap-1">
            <FiClock size={11} aria-hidden="true" />
            Updated {timeAgo(stats.pushedAt)}
          </span>
        )}
      </div>

      {stats.topics.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-ed-xs uppercase tracking-ed-wide text-ink-muted">
          {stats.topics.slice(0, 6).map(t => (
            <span key={t}>{t}</span>
          ))}
        </div>
      )}
    </div>
  )
}

function Stat({ icon, value, label }) {
  return (
    <span className="flex items-center gap-1 text-ink-muted">
      <span aria-hidden="true">{icon}</span>
      <span className="font-semibold text-ink">{value}</span>
      <span>{label}</span>
    </span>
  )
}
