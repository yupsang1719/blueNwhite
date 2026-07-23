import { unsubscribeUrl as makeUnsubUrl } from '../shared/unsubscribeToken.js'

// Personal/local outreach — shows pricing, honest personal tone, dark header design.
// vars: { name, company, location, customLine }
export function personalTemplate({ name = 'there', company = '', location = '', customLine = '' } = {}, contactId) {
  const greeting = name && name !== 'there' ? `Hi ${name},` : 'Hi there,'
  const businessRef = company ? `<strong style="font-weight:500;">${company}</strong>` : 'your business'
  const unsubUrl = contactId ? makeUnsubUrl(contactId) : '#'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Email from Birash Thing</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">

  <!-- Preview text -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">Your business deserves a website that works as hard as you do.&nbsp;&zwnj;</div>

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f5f9;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">

          <!-- Dark header -->
          <tr>
            <td style="background:#0f1b2d;padding:32px 32px 28px;">

              <!-- Sender row -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                <tr>
                  <td style="width:36px;height:36px;border-radius:50%;background:#1d9e75;text-align:center;vertical-align:middle;font-size:13px;font-weight:500;color:#e1f5ee;" width="36">BT</td>
                  <td style="padding-left:10px;vertical-align:middle;">
                    <p style="margin:0;font-size:13px;font-weight:500;color:#e2e8f0;line-height:1.4;">Birash Thing</p>
                    <p style="margin:0;font-size:11px;color:#64748b;line-height:1.4;">birash@bluenwhite.co.uk</p>
                  </td>
                </tr>
              </table>

              <!-- Subject -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="border-top:1px solid rgba(255,255,255,0.08);padding-top:24px;">
                    <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.08em;color:#64748b;text-transform:uppercase;">Subject</p>
                    <p style="margin:0;font-size:20px;font-weight:500;color:#f1f5f9;line-height:1.3;">Your business deserves a website that works as hard as you do.</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">

              <p style="margin:0 0 20px;font-size:15px;color:#1e293b;line-height:1.7;">${greeting}</p>

              <p style="margin:0 0 20px;font-size:15px;color:#1e293b;line-height:1.7;">
                My name is <strong style="font-weight:500;">Birash</strong> — I'm a full-stack web developer living right here in Aldershot, Hampshire.
                I came across ${businessRef}${location ? ` in ${location}` : ''} and thought I'd reach out personally.
                ${customLine ? `<br><br>${customLine}` : ''}
              </p>

              <p style="margin:0 0 20px;font-size:15px;color:#1e293b;line-height:1.7;">
                I'm not an agency. I'm just someone with real skills, a day job, and evenings I'd love to spend
                building something useful for local businesses like yours — and earning a little extra to support my family.
              </p>

              <!-- What you get -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 16px;font-size:11px;font-weight:700;letter-spacing:0.08em;color:#64748b;text-transform:uppercase;">What you get</p>

                    <!-- Feature rows -->
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="padding-bottom:12px;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="width:24px;font-size:16px;color:#1d9e75;vertical-align:top;padding-top:2px;" width="24">&#9670;</td>
                              <td style="padding-left:8px;">
                                <p style="margin:0;font-size:14px;font-weight:500;color:#1e293b;">Custom-designed website</p>
                                <p style="margin:0;font-size:13px;color:#64748b;">Built around your brand — not a template</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:12px;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="width:24px;font-size:16px;color:#1d9e75;vertical-align:top;padding-top:2px;" width="24">&#9670;</td>
                              <td style="padding-left:8px;">
                                <p style="margin:0;font-size:14px;font-weight:500;color:#1e293b;">Your own CMS</p>
                                <p style="margin:0;font-size:13px;color:#64748b;">Update your content yourself — no tech skills needed</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom:12px;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="width:24px;font-size:16px;color:#1d9e75;vertical-align:top;padding-top:2px;" width="24">&#9670;</td>
                              <td style="padding-left:8px;">
                                <p style="margin:0;font-size:14px;font-weight:500;color:#1e293b;">Mobile-friendly &amp; fast</p>
                                <p style="margin:0;font-size:13px;color:#64748b;">Looks great on every device</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="width:24px;font-size:16px;color:#1d9e75;vertical-align:top;padding-top:2px;" width="24">&#9670;</td>
                              <td style="padding-left:8px;">
                                <p style="margin:0;font-size:14px;font-weight:500;color:#1e293b;">Ongoing personal support</p>
                                <p style="margin:0;font-size:13px;color:#64748b;">You'll always deal directly with me</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Pricing — two columns via table -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
                <tr>
                  <td width="48%" style="background:#0f1b2d;border-radius:10px;padding:20px;text-align:center;">
                    <p style="margin:0 0 4px;font-size:28px;font-weight:500;color:#f1f5f9;">&#163;150</p>
                    <p style="margin:0;font-size:12px;color:#64748b;">one-time build fee</p>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" style="background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;padding:20px;text-align:center;">
                    <p style="margin:0 0 4px;font-size:28px;font-weight:500;color:#1e293b;">&#163;20<span style="font-size:14px;font-weight:400;color:#64748b;">/yr</span></p>
                    <p style="margin:0;font-size:12px;color:#64748b;">hosting + domain included</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 20px;font-size:15px;color:#1e293b;line-height:1.7;">
                No hidden fees. No agency markups. Just honest work from someone local — for less than &#163;2 a month after the build.
              </p>

              <p style="margin:0 0 24px;font-size:15px;color:#1e293b;line-height:1.7;">
                You can see my work at <a href="https://bluenwhite.co.uk" style="color:#1d9e75;text-decoration:none;font-weight:500;">bluenwhite.co.uk</a> — I'd love to build something you're genuinely proud of.
              </p>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 24px;">
                <tr>
                  <td align="center" style="border-radius:8px;background:#0f1b2d;">
                    <a href="mailto:birash@bluenwhite.co.uk" style="display:inline-block;padding:13px 28px;font-size:14px;font-weight:500;color:#f1f5f9;text-decoration:none;border-radius:8px;">
                      Let's have a chat &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px;font-size:15px;color:#1e293b;line-height:1.7;">
                No pressure at all — just reply or give me a call.<br>Thanks so much for reading.
              </p>

              <!-- Signature -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-top:1px solid #e2e8f0;padding-top:20px;margin-top:4px;">
                <tr>
                  <td style="padding-top:20px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="width:40px;height:40px;border-radius:50%;background:#1d9e75;text-align:center;vertical-align:middle;font-size:13px;font-weight:500;color:#e1f5ee;" width="40">BT</td>
                        <td style="padding-left:12px;vertical-align:middle;">
                          <p style="margin:0;font-size:14px;font-weight:500;color:#1e293b;">Birash Thing</p>
                          <p style="margin:0;font-size:12px;color:#64748b;">Full-stack developer &bull; Aldershot, Hampshire</p>
                          <p style="margin:0;font-size:12px;color:#64748b;">
                            <a href="https://bluenwhite.co.uk" style="color:#1d9e75;text-decoration:none;">bluenwhite.co.uk</a>
                            &bull; 07778 781635
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Unsubscribe -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;">
                <tr>
                  <td style="font-size:11px;color:#94a3b8;line-height:1.6;">
                    You received this because your business may benefit from our services.
                    <a href="${unsubUrl}" style="color:#94a3b8;text-decoration:underline;">Unsubscribe</a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>`
}
