interface LayoutParams {
	title: string;
	bodyHtml: string;
	footerLinks: {
		prefs: string;
		unsub: string;
	};
}

export function emailLayout({ title, bodyHtml, footerLinks }: LayoutParams): string {
	return `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:Inter,ui-sans-serif,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color:#2d7a4f;padding:24px 32px;">
              <a href="https://viatamaibuna.ro" style="color:#ffffff;text-decoration:none;font-size:20px;font-weight:700;">Better Life</a>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;color:#1f2937;font-size:16px;line-height:1.6;">
              ${bodyHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f3f4f6;padding:24px 32px;border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">
                Primești acest email pentru că ai completat un test pe Better Life.
              </p>
              <p style="margin:0;color:#6b7280;font-size:13px;">
                <a href="${footerLinks.prefs}" style="color:#2d7a4f;text-decoration:underline;">Preferințe email</a>
                &nbsp;·&nbsp;
                <a href="${footerLinks.unsub}" style="color:#2d7a4f;text-decoration:underline;">Dezabonare</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
