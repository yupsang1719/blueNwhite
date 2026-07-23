import { Router } from 'express'
import { Resend } from 'resend'
import Campaign from '../models/Campaign.js'
import List from '../models/List.js'
import Contact from '../models/Contact.js'
import { outreachTemplate } from '../emails/outreach.js'
import { followUpTemplate } from '../emails/followup.js'
import { personalTemplate } from '../emails/personal.js'
import { unsubscribeUrl } from '../shared/unsubscribeToken.js'

const router = Router()

const TEMPLATES = {
  outreach: outreachTemplate,
  followup: followUpTemplate,
  personal: personalTemplate,
}

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

// GET /api/admin/campaigns
router.get('/', async (_req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 }).lean()
    res.json(campaigns)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/admin/campaigns — create campaign
router.post('/', async (req, res) => {
  const { name, subject, templateId, listIds } = req.body
  if (!name || !subject || !templateId) {
    return res.status(400).json({ error: 'name, subject, and templateId are required' })
  }
  if (!TEMPLATES[templateId]) {
    return res.status(400).json({ error: `Unknown template: ${templateId}` })
  }

  try {
    const campaign = await Campaign.create({ name, subject, templateId, listIds: listIds || [] })
    res.status(201).json(campaign)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/admin/campaigns/:id — with populated list metadata
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).lean()
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' })
    const lists = await List.find({ _id: { $in: campaign.listIds } }).lean()
    res.json({
      ...campaign,
      lists: lists.map(l => ({ _id: l._id, name: l.name, contactCount: l.contactIds.length })),
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/admin/campaigns/:id/contacts — prospects (draft) or sent log (sent)
router.get('/:id/contacts', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).lean()
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' })

    // For sent/failed campaigns return stored sentEmails log
    if (campaign.sentEmails?.length > 0) {
      return res.json({ source: 'sent', contacts: campaign.sentEmails })
    }

    // For draft campaigns resolve contacts from lists live
    const lists = await List.find({ _id: { $in: campaign.listIds } }).lean()
    const allIds = [...new Set(lists.flatMap(l => l.contactIds.map(String)))]
    const contacts = await Contact.find({ _id: { $in: allIds } }).lean()
    res.json({
      source: 'draft',
      contacts: contacts.map(c => ({
        contactId: c._id,
        email: c.email,
        name: c.name || '',
        company: c.company || '',
        location: c.location || '',
        unsubscribed: c.unsubscribed,
        status: c.unsubscribed ? 'skipped' : 'pending',
      })),
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/admin/campaigns/:id/send — fire-and-forget bulk send
router.post('/:id/send', async (req, res) => {
  let campaign
  try {
    campaign = await Campaign.findById(req.params.id)
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' })
    if (campaign.status === 'sending') return res.status(409).json({ error: 'Already sending' })
    if (campaign.status === 'sent') return res.status(409).json({ error: 'Already sent' })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }

  // Respond immediately — send runs in background
  res.json({ ok: true, message: 'Send started' })

  // Resolve contacts across all lists, deduplicated
  const lists = await List.find({ _id: { $in: campaign.listIds } }).lean()
  const allIds = [...new Set(lists.flatMap(l => l.contactIds.map(String)))]
  const contacts = await Contact.find({
    _id: { $in: allIds },
    unsubscribed: false,
  }).lean()

  await Campaign.findByIdAndUpdate(campaign._id, {
    status: 'sending',
    'stats.total': contacts.length,
  })

  const resend = getResend()
  const templateFn = TEMPLATES[campaign.templateId]
  let sent = 0
  let failed = 0
  const sentEmails = []

  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i]
    const unsub = unsubscribeUrl(contact._id)
    // personalTemplate accepts contactId as 2nd arg and injects unsubscribe itself
    // other templates use wrapBase with a '#' placeholder that we replace
    const html = templateFn(
      { name: contact.name, company: contact.company, location: contact.location },
      contact._id
    ).replace('href="#"', `href="${unsub}"`)

    const record = {
      contactId: contact._id,
      email: contact.email,
      name: contact.name || '',
      company: contact.company || '',
      location: contact.location || '',
    }

    try {
      const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM,
        to: contact.email,
        subject: campaign.subject,
        html,
      })
      if (error) throw new Error(error.message)
      sentEmails.push({ ...record, status: 'sent', resendId: data?.id })
      sent++
    } catch (err) {
      console.error(`Failed to send to ${contact.email}:`, err.message)
      sentEmails.push({ ...record, status: 'failed', error: err.message })
      failed++
    }

    // Resend rate limit: pause every 50 emails
    if ((i + 1) % 50 === 0) await sleep(1000)
  }

  await Campaign.findByIdAndUpdate(campaign._id, {
    status: failed === contacts.length ? 'failed' : 'sent',
    sentAt: new Date(),
    'stats.sent': sent,
    'stats.failed': failed,
    sentEmails,
  })

  console.log(`Campaign "${campaign.name}" done — sent: ${sent}, failed: ${failed}`)
})

// POST /api/admin/send/single — send to one address (test or individual)
router.post('/single', async (req, res) => {
  const { to, subject, templateId, name, company, location, customLine } = req.body
  if (!to || !subject || !templateId) {
    return res.status(400).json({ error: 'to, subject, and templateId are required' })
  }
  const templateFn = TEMPLATES[templateId]
  if (!templateFn) return res.status(400).json({ error: `Unknown template: ${templateId}` })

  const html = templateFn({ name, company, location, customLine })

  try {
    const resend = getResend()
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM,
      to,
      subject,
      html,
    })
    if (error) return res.status(500).json({ error: error.message })
    res.json({ ok: true, id: data?.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
