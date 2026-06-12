interface OrderItem {
	name: string;
	quantity: number;
	unit_amount: number;
}

interface OrderConfirmParams {
	orderId: string;
	email: string;
	items: OrderItem[];
	amountTotal: number;
	currency: string;
	shippingAddress?: {
		line1?: string | null;
		line2?: string | null;
		city?: string | null;
		state?: string | null;
		postal_code?: string | null;
		country?: string | null;
	} | null;
}

function formatRon(cents: number): string {
	return new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(cents / 100);
}

export function orderConfirmEmail(params: OrderConfirmParams): string {
	const { orderId, items, amountTotal, shippingAddress } = params;

	const itemRows = items
		.map(
			(item) => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;color:#374151;">${item.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;color:#374151;text-align:center;">×${item.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;color:#374151;text-align:right;">${formatRon(item.unit_amount * item.quantity)}</td>
    </tr>`
		)
		.join('');

	const addressBlock = shippingAddress
		? `
    <p style="margin:16px 0 4px;font-weight:600;color:#374151;">Adresă de livrare:</p>
    <p style="margin:0;color:#6b7280;line-height:1.6;">
      ${[shippingAddress.line1, shippingAddress.line2, shippingAddress.city, shippingAddress.state, shippingAddress.postal_code, shippingAddress.country].filter(Boolean).join(', ')}
    </p>`
		: '';

	return `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Confirmare comandă</title>
</head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:Inter,ui-sans-serif,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color:#2d7a4f;padding:24px 32px;">
              <a href="https://viatamaibuna.ro" style="color:#ffffff;text-decoration:none;font-size:20px;font-weight:700;">Viață Mai Bună</a>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;color:#1f2937;font-size:16px;line-height:1.6;">
              <h2 style="margin:0 0 16px;color:#111827;font-size:22px;">Mulțumim pentru comandă!</h2>
              <p style="margin:0 0 16px;">Comanda ta a fost înregistrată cu succes. Mai jos găsești detaliile:</p>
              <p style="margin:0 0 16px;color:#6b7280;font-size:14px;">Nr. comandă: <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;">${orderId.slice(0, 8).toUpperCase()}</code></p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 16px;">
                <thead>
                  <tr>
                    <th style="padding:8px 0;border-bottom:2px solid #e5e7eb;text-align:left;color:#374151;font-size:14px;">Produs</th>
                    <th style="padding:8px 0;border-bottom:2px solid #e5e7eb;text-align:center;color:#374151;font-size:14px;">Cant.</th>
                    <th style="padding:8px 0;border-bottom:2px solid #e5e7eb;text-align:right;color:#374151;font-size:14px;">Preț</th>
                  </tr>
                </thead>
                <tbody>${itemRows}</tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding:12px 0 0;font-weight:700;color:#111827;">Total</td>
                    <td style="padding:12px 0 0;text-align:right;font-weight:700;color:#111827;">${formatRon(amountTotal)}</td>
                  </tr>
                </tfoot>
              </table>
              ${addressBlock}
              <p style="margin:24px 0 0;">
                <a href="https://viatamaibuna.ro" style="color:#2d7a4f;text-decoration:underline;">Vizitează Viață Mai Bună</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f3f4f6;padding:24px 32px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#6b7280;font-size:13px;">
                Acesta este un email de confirmare tranzacțional. Dacă ai întrebări, răspunde la acest email.
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
