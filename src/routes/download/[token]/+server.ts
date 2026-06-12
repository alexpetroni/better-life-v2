import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db/client.js';
import { download_tokens, order_items, products } from '$lib/server/db/schema.js';
import { eq, sql } from 'drizzle-orm';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export async function GET({ params }) {
	const { token } = params;

	// Atomic claim: increment only if not expired and under quota
	const result = await db.execute(sql`
		UPDATE download_tokens
		SET download_count = download_count + 1
		WHERE token = ${token}
		  AND expires_at > now()
		  AND download_count < max_downloads
		RETURNING order_item_id
	`);

	const rows = result as unknown as Array<{ order_item_id: string }>;

	if (!rows || rows.length === 0) {
		throw error(410, 'Linkul de descărcare a expirat sau a atins limita maximă de utilizări.');
	}

	const orderItemId = rows[0].order_item_id;

	const [item] = await db
		.select({ product_id: order_items.product_id })
		.from(order_items)
		.where(eq(order_items.id, orderItemId));

	if (!item) {
		throw error(410, 'Linkul de descărcare nu mai este valid.');
	}

	const [product] = await db
		.select({ digital_file_key: products.digital_file_key, name: products.name })
		.from(products)
		.where(eq(products.id, item.product_id));

	if (!product?.digital_file_key) {
		throw error(500, 'Fișierul nu a fost găsit.');
	}

	if (env.BLOB_READ_WRITE_TOKEN) {
		// Redirect to Vercel Blob signed URL (not implemented — no Blob token in dev)
		throw error(500, 'Blob storage not configured.');
	}

	// Serve from static/digital/<key>
	const filePath = join(process.cwd(), 'static', 'digital', product.digital_file_key);

	if (!existsSync(filePath)) {
		throw error(404, 'Fișierul nu a fost găsit pe server.');
	}

	const fileBuffer = readFileSync(filePath);
	const filename = encodeURIComponent(product.digital_file_key);

	return new Response(fileBuffer, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': `attachment; filename="${filename}"`,
			'Content-Length': String(fileBuffer.length)
		}
	});
}
