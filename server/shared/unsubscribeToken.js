import crypto from 'crypto'

function secret() {
  const s = process.env.ADMIN_SECRET
  if (!s) throw new Error('ADMIN_SECRET not set')
  return s
}

export function generateToken(contactId) {
  return crypto
    .createHmac('sha256', secret())
    .update(String(contactId))
    .digest('hex')
}

export function verifyToken(contactId, token) {
  const expected = generateToken(contactId)
  return crypto.timingSafeEqual(Buffer.from(token, 'hex'), Buffer.from(expected, 'hex'))
}

export function unsubscribeUrl(contactId) {
  const token = generateToken(contactId)
  const base = process.env.SERVER_URL || 'http://localhost:4001'
  return `${base}/unsubscribe?id=${contactId}&token=${token}`
}
