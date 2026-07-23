import { wrapBase } from './base.js'

// Cold outreach — introduce services, link to portfolio, CTA to book a call.
// vars: { name, company, location, customLine }
export function outreachTemplate({ name = 'there', company = '', location = '', customLine = '' } = {}) {
  const greeting = name && name !== 'there' ? `Hi ${name},` : 'Hi there,'
  const companyLine = company ? ` at <strong>${company}</strong>` : ''

  const body = `
    <p style="margin:0 0 20px;font-size:16px;color:#374151;line-height:1.7;">
      ${greeting}
    </p>

    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
      I came across your business${companyLine}${location ? ` in ${location}` : ''} and wanted to reach out.
      ${customLine ? `<br /><br />${customLine}` : ''}
    </p>

    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7;">
      I'm <strong>Birash</strong> — a full-stack web developer and digital marketing specialist based in Aldershot.
      I help local businesses like yours get more customers online with:
    </p>

    <!-- Services list -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
      <tr>
        <td style="padding:16px 20px;background:#eff6ff;border-left:4px solid #2563eb;border-radius:0 8px 8px 0;">
          <ul style="margin:0;padding:0 0 0 18px;color:#1e40af;font-size:14px;line-height:2;">
            <li>Modern, mobile-friendly websites built fast</li>
            <li>Social media content &amp; management</li>
            <li>Photography, videography &amp; graphic design</li>
            <li>Online booking &amp; ticketing systems</li>
          </ul>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 28px;font-size:15px;color:#374151;line-height:1.7;">
      I've worked with hospitality venues and built platforms handling real bookings and payments.
      Happy to show you what I've done and talk about what might work for you — no obligation.
    </p>

    <!-- CTA Button -->
    <table cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
      <tr>
        <td style="border-radius:8px;background:#2563eb;">
          <a href="https://bluenwhite.co.uk" target="_blank"
             style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;letter-spacing:0.2px;">
            View My Portfolio →
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0;font-size:15px;color:#374151;line-height:1.7;">
      Or simply reply to this email — I'm always happy to have a quick chat.
      <br /><br />
      Best,<br />
      <strong>Birash Thing</strong><br />
      <span style="color:#6b7280;font-size:14px;">07778 781635 &bull; bluenwhite.co.uk</span>
    </p>
  `

  return wrapBase({
    previewText: `Web development & marketing services for ${company || 'your business'}`,
    body,
  })
}
