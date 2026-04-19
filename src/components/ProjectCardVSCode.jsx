// src/components/ProjectCardVSCode.jsx
import { Link } from 'react-router-dom'
import { FiExternalLink, FiGithub, FiMaximize2 } from 'react-icons/fi'
import { useDarkMode } from '../shared/useDarkMode'

const TECH_COLORS = {
  'React':        { light: ['#ebf9ff', '#0369a1', '#bae6fd'], dark: ['#0c2a3a', '#38bdf8', '#164e63'] },
  'Node':         { light: ['#f0fdf4', '#15803d', '#bbf7d0'], dark: ['#052e16', '#4ade80', '#14532d'] },
  'Node.js':      { light: ['#f0fdf4', '#15803d', '#bbf7d0'], dark: ['#052e16', '#4ade80', '#14532d'] },
  'Express':      { light: ['#f5f5f5', '#525252', '#e5e5e5'], dark: ['#1c1c1c', '#a3a3a3', '#333333'] },
  'MongoDB':      { light: ['#f0fdf4', '#166534', '#86efac'], dark: ['#052e16', '#86efac', '#14532d'] },
  'Mongoose':     { light: ['#fef2f2', '#991b1b', '#fecaca'], dark: ['#2d0a0a', '#fca5a5', '#7f1d1d'] },
  'Socket.io':    { light: ['#f8fafc', '#334155', '#cbd5e1'], dark: ['#0f172a', '#94a3b8', '#1e293b'] },
  'Redis':        { light: ['#fff1f2', '#be123c', '#fda4af'], dark: ['#2d0a0f', '#fb7185', '#881337'] },
  'Docker':       { light: ['#eff6ff', '#1d4ed8', '#bfdbfe'], dark: ['#0c1a3a', '#60a5fa', '#1e3a8a'] },
  'Stripe':       { light: ['#f5f3ff', '#6d28d9', '#ddd6fe'], dark: ['#1a0a3a', '#a78bfa', '#4c1d95'] },
  'Cloudinary':   { light: ['#eff6ff', '#1e40af', '#bfdbfe'], dark: ['#0c1a3a', '#60a5fa', '#1e3a8a'] },
  'Chart.js':     { light: ['#fefce8', '#854d0e', '#fde68a'], dark: ['#1c1000', '#fbbf24', '#713f12'] },
  'Tailwind CSS': { light: ['#ecfeff', '#0e7490', '#a5f3fc'], dark: ['#061b1e', '#22d3ee', '#164e63'] },
  'Vite':         { light: ['#f5f3ff', '#7c3aed', '#ddd6fe'], dark: ['#1a0a3a', '#a78bfa', '#4c1d95'] },
  'JWT':          { light: ['#fdf4ff', '#7e22ce', '#e9d5ff'], dark: ['#1a0a2a', '#c084fc', '#581c87'] },
  'TypeScript':   { light: ['#eff6ff', '#1d4ed8', '#bfdbfe'], dark: ['#0c1a3a', '#60a5fa', '#1e3a8a'] },
  'AWS S3':       { light: ['#fff7ed', '#c2410c', '#fed7aa'], dark: ['#2a0f00', '#fb923c', '#7c2d12'] },
  'Recharts':     { light: ['#fdf4ff', '#7e22ce', '#e9d5ff'], dark: ['#1a0a2a', '#c084fc', '#581c87'] },
  'Zod':          { light: ['#eff6ff', '#1d4ed8', '#bfdbfe'], dark: ['#0c1a3a', '#60a5fa', '#1e3a8a'] },
}

const DEFAULT_CHIP = {
  light: ['#f9fafb', '#374151', '#e5e7eb'],
  dark:  ['#1a1a1a', '#d1d5db', '#333333'],
}

function chipStyle(tech, dark) {
  const entry = TECH_COLORS[tech] || DEFAULT_CHIP
  const [bg, text, border] = dark ? entry.dark : entry.light
  return { backgroundColor: bg, color: text, border: `1px solid ${border}` }
}

export default function ProjectCardVSCode({ project }) {
  const [dark] = useDarkMode()
  const slugSafe = (project?.slug || 'project').replace(/[^a-z0-9-]/gi, '')
  const fileName = `${slugSafe}.json`

  const truncate = (str = '', max = 110) =>
    str.length > max ? str.slice(0, max - 1) + '…' : str

  const lines = [
    '{',
    `  "name": "${truncate(project?.title || 'Project', 60)}",`,
    `  "summary": "${truncate((project?.summary || '').replace(/"/g, '\\"'), 120)}",`,
    `  "stack": ${JSON.stringify((project?.tech || []).slice(0, 5))},`,
    project?.liveUrl ? `  "live": "${truncate(project.liveUrl, 80)}",` : undefined,
    project?.repoUrl ? `  "repo": "${truncate(project.repoUrl, 80)}"` : undefined,
    '}',
  ].filter(Boolean)

  return (
    <div className="group relative w-full">
      <Link to={`/projects/${project.slug}`} className="absolute inset-0 z-10" aria-label={`Open ${project.title}`} />

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white/90 shadow-sm backdrop-blur-sm transition
                      dark:border-neutral-800 dark:bg-neutral-900/70 group-hover:shadow-lg group-hover:-translate-y-0.5">

        {/* Titlebar */}
        <div className="flex items-center justify-between border-b border-neutral-200/80 px-2.5 py-2
                        dark:border-neutral-800/80 bg-neutral-50/70 dark:bg-neutral-900/60">
          <div className="flex min-w-0 items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/90" />
            <span className="ml-2 max-w-[50vw] truncate rounded-md border border-neutral-200 px-2 py-0.5 text-[11px]
                             dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/80 sm:max-w-[14rem] sm:text-xs">
              {fileName}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 text-neutral-500">
            {project?.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noreferrer"
                 className="relative z-20 grid h-8 w-8 place-items-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
                 aria-label={`View ${project.title} repository`}
                 onClick={(e) => e.stopPropagation()}>
                <FiGithub size={16} />
              </a>
            )}
            {project?.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer"
                 className="relative z-20 grid h-8 w-8 place-items-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
                 aria-label={`View ${project.title} live site`}
                 onClick={(e) => e.stopPropagation()}>
                <FiExternalLink size={16} />
              </a>
            )}
            <div className="grid h-8 w-8 place-items-center rounded-md text-neutral-400">
              <FiMaximize2 size={16} />
            </div>
          </div>
        </div>

        {/* Code area (scrolls horizontally on XS to avoid squish) */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.06),_transparent_60%)]
                          dark:bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.12),_transparent_70%)]" />
          <div className="overflow-x-auto">
            <div className="grid min-w-[28rem] grid-cols-[auto,1fr] gap-3 px-3 py-3 font-mono text-[12px] leading-relaxed
                            sm:min-w-0 sm:gap-4 sm:px-4 sm:py-4 sm:text-[13px]">
              {/* Line numbers */}
              <div className="select-none pr-1 text-right text-neutral-400 dark:text-neutral-500">
                {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
              </div>
              {/* JSON (safe JSX tokenizer) */}
              <div className="text-neutral-800 dark:text-neutral-200">
                {lines.map((line, i) => <JsonLine key={i} text={line} />)}
              </div>
            </div>
          </div>
        </div>

        {/* Footer chips */}
        <div className="flex flex-wrap gap-2 border-t border-neutral-200/80 p-3 dark:border-neutral-800/80">
          {(project?.tech || []).slice(0, 6).map(t => (
            <span
              key={t}
              className="rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={chipStyle(t, dark)}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/** JSX-based tokenizer so we never touch HTML attributes */
function JsonLine({ text }) {
  // Preserve indentation
  const indent = (text.match(/^\s*/) || [''])[0]
  const content = text.slice(indent.length)

  // Braces-only lines
  if (content === '{' || content === '}') {
    return <div><span className="whitespace-pre">{indent}</span>{content}</div>
  }

  // key: value [,]
  const m = content.match(/^"([^"]+)"\s*:\s*(.*?)(,?)$/)
  if (!m) {
    return <div className="whitespace-pre">{text}</div>
  }

  const [, key, rawVal, comma] = m

  // string value?
  if (/^"/.test(rawVal)) {
    const val = rawVal.replace(/^"/, '').replace(/"$/, '')
    return (
      <div>
        <span className="whitespace-pre">{indent}</span>
        <span className="text-blue-600 dark:text-blue-400">"{key}"</span>
        <span>: </span>
        <span className="text-amber-500 dark:text-amber-400">"{val}"</span>
        <span>{comma}</span>
      </div>
    )
  }

  // non-string (arrays/objects/numbers)
  return (
    <div>
      <span className="whitespace-pre">{indent}</span>
      <span className="text-blue-600 dark:text-blue-400">"{key}"</span>
      <span>: </span>
      <span>{rawVal}</span>
      <span>{comma}</span>
    </div>
  )
}