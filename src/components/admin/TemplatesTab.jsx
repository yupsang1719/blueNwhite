import { useState, useEffect, useRef } from 'react'
import { LuMail, LuExternalLink, LuChevronDown, LuChevronUp } from 'react-icons/lu'
import { adminApi } from '../../shared/adminApi'
import { useToast } from './Toast'

const TEMPLATE_META = {
  personal: {
    label: 'Personal Local Outreach',
    description: 'Dark header design with pricing (£150 build / £20 yr). Honest, no-agency tone.',
    variables: [
      { key: 'name',       label: 'Name',        placeholder: 'Sarah',         hint: 'Contact first name' },
      { key: 'company',    label: 'Company',     placeholder: 'The Dental Co', hint: 'Business name' },
      { key: 'location',   label: 'Location',    placeholder: 'Aldershot',     hint: 'Town or area' },
      { key: 'customLine', label: 'Custom line', placeholder: 'I noticed your website is a bit dated…', hint: 'Personal observation (optional)' },
    ],
  },
  outreach: {
    label: 'Cold Outreach',
    description: 'Introduce your services to a new prospect. Best for first contact.',
    variables: [
      { key: 'name',       label: 'Name',        placeholder: 'John',          hint: 'Contact first name' },
      { key: 'company',    label: 'Company',     placeholder: 'The Red Lion',  hint: 'Business name' },
      { key: 'location',   label: 'Location',    placeholder: 'Aldershot',     hint: 'Town or area' },
      { key: 'customLine', label: 'Custom line', placeholder: 'I noticed your website could do with a refresh…', hint: 'Personal touch (optional)' },
    ],
  },
  followup: {
    label: 'Follow-up',
    description: 'Short, friendly nudge for contacts who didn\'t reply to outreach.',
    variables: [
      { key: 'name',    label: 'Name',    placeholder: 'Sarah',        hint: 'Contact first name' },
      { key: 'company', label: 'Company', placeholder: 'The Crown Inn', hint: 'Business name' },
    ],
  },
}

function TemplateCard({ template }) {
  const meta = TEMPLATE_META[template.id] || {
    label: template.name,
    description: '',
    variables: [
      { key: 'name',    label: 'Name',    placeholder: 'John' },
      { key: 'company', label: 'Company', placeholder: 'Acme Ltd' },
    ],
  }

  const [vars, setVars] = useState(
    Object.fromEntries(meta.variables.map(v => [v.key, '']))
  )
  const [expanded, setExpanded] = useState(false)
  const [iframeKey, setIframeKey] = useState(0)
  const debounce = useRef(null)

  // Debounce iframe reload when vars change
  useEffect(() => {
    if (!expanded) return
    clearTimeout(debounce.current)
    debounce.current = setTimeout(() => setIframeKey(k => k + 1), 500)
  }, [vars, expanded])

  function setVar(key) { return e => setVars(v => ({ ...v, [key]: e.target.value })) }

  const previewUrl = adminApi.previewUrl(template.id, Object.fromEntries(
    Object.entries(vars).filter(([, v]) => v.trim())
  ))

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      {/* Card header */}
      <div
        className="flex items-center justify-between px-6 py-5 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <LuMail className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{meta.label}</h3>
            <p className="text-sm text-gray-400 mt-0.5">{meta.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-400 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <LuExternalLink className="w-3.5 h-3.5" />
            Open full tab
          </a>
          {expanded
            ? <LuChevronUp className="w-5 h-5 text-gray-400" />
            : <LuChevronDown className="w-5 h-5 text-gray-400" />
          }
        </div>
      </div>

      {/* Expanded: variables + iframe */}
      {expanded && (
        <div className="border-t border-gray-100 flex" style={{ minHeight: 600 }}>
          {/* Variable panel */}
          <div className="w-64 shrink-0 border-r border-gray-100 p-5 space-y-4 bg-gray-50">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Preview variables</p>
            {meta.variables.map(v => (
              <div key={v.key}>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {v.label}
                  {v.hint && <span className="font-normal text-gray-400 ml-1">— {v.hint}</span>}
                </label>
                {v.key === 'customLine' ? (
                  <textarea
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    placeholder={v.placeholder}
                    value={vars[v.key]}
                    onChange={setVar(v.key)}
                  />
                ) : (
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder={v.placeholder}
                    value={vars[v.key]}
                    onChange={setVar(v.key)}
                  />
                )}
              </div>
            ))}
            <p className="text-xs text-gray-400 pt-2 border-t border-gray-200">
              Preview updates 0.5s after you stop typing.
            </p>
          </div>

          {/* Iframe preview */}
          <div className="flex-1 bg-gray-100 p-4">
            <iframe
              key={iframeKey}
              src={previewUrl}
              className="w-full h-full rounded-xl border border-gray-200 bg-white"
              style={{ minHeight: 560 }}
              title={`${meta.label} preview`}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default function TemplatesTab() {
  const toast = useToast()
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getTemplates()
      .then(setTemplates)
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Templates</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Preview your email templates with sample data. Templates are edited in code at <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">server/emails/</code>
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-100" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-100 rounded w-1/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {templates.map(t => <TemplateCard key={t.id} template={t} />)}
        </div>
      )}
    </div>
  )
}
