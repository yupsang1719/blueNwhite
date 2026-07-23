import { wrapBase } from './base.js'

// Short follow-up for contacts who didn't respond to outreach.
// vars: { name, company }
export function followUpTemplate({ name = 'there', company = '' } = {}) {
  const greeting = name && name !== 'there' ? `Hi ${name},` : 'Hi there,'
  const companyRef = company ? `the team at ${company}` : 'you'

  const body = `
    <p style="margin:0 0 20px;font-size:16px;color:#374151;line-height:1.7;">
      ${greeting}
    </p>

    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
      I wanted to follow up on my previous email — I reached out a little while ago about web development
      and digital marketing services for ${companyRef}.
    </p>

    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
      I know inboxes get busy, so just wanted to resurface this in case it got buried.
      If now isn't the right time, that's completely fine — just let me know and I won't bother you again.
    </p>

    <p style="margin:0 0 28px;font-size:15px;color:#374151;line-height:1.7;">
      If you <em>are</em> curious, I'd love to show you a few examples of what I've built for similar businesses.
      Even a 10-minute call could be worth your while.
    </p>

    <!-- CTA Button -->
    <table cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
      <tr>
        <td style="border-radius:8px;background:#2563eb;">
          <a href="https://bluenwhite.co.uk" target="_blank"
             style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">
            See My Work →
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0;font-size:15px;color:#374151;line-height:1.7;">
      Best,<br />
      <strong>Birash Thing</strong><br />
      <span style="color:#6b7280;font-size:14px;">07778 781635 &bull; bluenwhite.co.uk</span>
    </p>
  `

  return wrapBase({
    previewText: `Quick follow-up from Birash — web development for ${company || 'your business'}`,
    body,
  })
}
