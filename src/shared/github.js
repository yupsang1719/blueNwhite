const BASE = 'https://api.github.com'
const USERNAME = import.meta.env.VITE_GITHUB_USERNAME

/**
 * Fetch all public repos for the configured GitHub user,
 * sorted by most recently pushed, excluding forked repos.
 */
export async function fetchUserRepos() {
  if (!USERNAME || USERNAME === 'yourname') return []
  try {
    const res = await fetch(
      `${BASE}/users/${USERNAME}/repos?per_page=100&sort=pushed&direction=desc`,
      { headers: { Accept: 'application/vnd.github+json' } }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data
      .filter((r) => !r.fork)
      .map((r) => ({
        id:          r.id,
        name:        r.name,
        fullName:    r.full_name,
        description: r.description,
        htmlUrl:     r.html_url,
        homepage:    r.homepage,
        language:    r.language,
        stars:       r.stargazers_count,
        forks:       r.forks_count,
        topics:      r.topics ?? [],
        pushedAt:    r.pushed_at,
        createdAt:   r.created_at,
      }))
  } catch {
    return []
  }
}

/**
 * Fetch a single GitHub repo's live stats.
 * Returns null gracefully on any failure (rate limit, private, 404).
 */
export async function fetchRepo(repoName) {
  if (!USERNAME || !repoName || USERNAME === 'yourname') return null
  try {
    const res = await fetch(`${BASE}/repos/${USERNAME}/${repoName}`, {
      headers: { Accept: 'application/vnd.github+json' },
    })
    if (!res.ok) return null
    const d = await res.json()
    return {
      stars:     d.stargazers_count,
      forks:     d.forks_count,
      language:  d.language,
      topics:    d.topics ?? [],
      pushedAt:  d.pushed_at,
      htmlUrl:   d.html_url,
      openIssues: d.open_issues_count,
    }
  } catch {
    return null
  }
}

/** Human-readable relative time: "3d ago", "2mo ago", etc. */
export function timeAgo(isoDate) {
  if (!isoDate) return null
  const diff  = Date.now() - new Date(isoDate).getTime()
  const mins  = Math.floor(diff / 60_000)
  if (mins < 60)   return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs  < 24)   return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30)   return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

/** GitHub's canonical language colors for common web-dev languages */
export const LANG_COLORS = {
  JavaScript:  '#f1e05a',
  TypeScript:  '#3178c6',
  HTML:        '#e34c26',
  CSS:         '#563d7c',
  SCSS:        '#c6538c',
  Shell:       '#89e051',
  Dockerfile:  '#384d54',
  Python:      '#3572A5',
  Go:          '#00ADD8',
}
