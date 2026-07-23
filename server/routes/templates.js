import { Router } from 'express'
import { outreachTemplate } from '../emails/outreach.js'
import { followUpTemplate } from '../emails/followup.js'
import { personalTemplate } from '../emails/personal.js'

const router = Router()

const TEMPLATES = {
  outreach: outreachTemplate,
  followup: followUpTemplate,
  personal: personalTemplate,
}

// GET /api/admin/templates — list available templates
router.get('/', (_req, res) => {
  res.json(Object.keys(TEMPLATES).map(id => ({ id, name: id.charAt(0).toUpperCase() + id.slice(1) })))
})

// GET /api/admin/templates/:name/preview?name=John&company=The+Red+Lion&location=Aldershot
router.get('/:name/preview', (req, res) => {
  const fn = TEMPLATES[req.params.name]
  if (!fn) return res.status(404).json({ error: 'Template not found' })

  const { name, company, location, customLine } = req.query
  const html = fn({ name, company, location, customLine })

  res.setHeader('Content-Type', 'text/html')
  res.send(html)
})

export default router
