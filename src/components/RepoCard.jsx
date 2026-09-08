import { FiStar, FiGitBranch, FiExternalLink, FiGithub } from 'react-icons/fi'
import { timeAgo } from '../shared/github'
import ReactGA from 'react-ga4'

export default function RepoCard({ repo }) {
  return (
    <div className="py-6">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
        <a
          href={repo.htmlUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => ReactGA.event({ category: 'Repo', action: 'click_github', label: repo.name })}
          className="font-ed-serif font-bold text-ed-lg text-ink transition-colors hover:text-accent"
        >
          {repo.name}
        </a>
        <div className="flex shrink-0 items-center gap-3 text-ink-muted">
          <a
            href={repo.htmlUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            onClick={() => ReactGA.event({ category: 'Repo', action: 'click_github', label: repo.name })}
            className="transition-colors hover:text-accent"
          >
            <FiGithub size={15} />
          </a>
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noreferrer"
              aria-label="Live site"
              onClick={() => ReactGA.event({ category: 'Repo', action: 'click_live', label: repo.name })}
              className="transition-colors hover:text-accent"
            >
              <FiExternalLink size={15} />
            </a>
          )}
        </div>
      </div>

      {repo.description && (
        <p className="mt-2 max-w-prose text-ed-sm leading-normal text-ink-muted line-clamp-2">
          {repo.description}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-ed-xs uppercase tracking-ed-wide text-ink-muted">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-ink-muted" aria-hidden="true" />
            {repo.language}
          </span>
        )}
        {repo.stars > 0 && (
          <span className="flex items-center gap-1">
            <FiStar size={11} aria-hidden="true" /> {repo.stars}
          </span>
        )}
        {repo.forks > 0 && (
          <span className="flex items-center gap-1">
            <FiGitBranch size={11} aria-hidden="true" /> {repo.forks}
          </span>
        )}
        {repo.topics.slice(0, 4).map((t) => (
          <span key={t}>{t}</span>
        ))}
        {repo.pushedAt && (
          <span className="ml-auto normal-case tracking-normal">{timeAgo(repo.pushedAt)}</span>
        )}
      </div>
    </div>
  )
}
