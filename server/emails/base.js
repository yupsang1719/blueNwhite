// Wraps any email body in the shared branded layout.
// unsubscribeUrl is injected per-send by the campaign sender.
export function wrapBase({ previewText = '', body, unsubscribeUrl = '#' }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Email from Birash Thing</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">

  <!-- Preview text (hidden) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${previewText}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f7fb;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1d4ed8 0%,#2563eb 100%);padding:28px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Birash Thing</span>
                    <br />
                    <span style="font-size:12px;color:#bfdbfe;letter-spacing:1.5px;text-transform:uppercase;">Web Developer &amp; Digital Marketing</span>
                  </td>
                  <td align="right">
                    <span style="font-size:28px;">🐝</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 28px;">
              ${body}
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="border-top:1px solid #e5e7eb;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size:12px;color:#9ca3af;line-height:1.6;">
                    <strong style="color:#6b7280;">Birash Thing</strong> &bull; Aldershot, Hampshire, UK<br />
                    <a href="https://bluenwhite.co.uk" style="color:#2563eb;text-decoration:none;">bluenwhite.co.uk</a>
                    &nbsp;&bull;&nbsp;
                    <a href="mailto:birash@bluenwhite.co.uk" style="color:#2563eb;text-decoration:none;">birash@bluenwhite.co.uk</a>
                    <br /><br />
                    You received this email because your business may benefit from our services.
                    <br />
                    <a href="${unsubscribeUrl}" style="color:#9ca3af;text-decoration:underline;">Unsubscribe</a>
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
