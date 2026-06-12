process.loadEnvFile();

import postgres from 'postgres';

const sql_query = process.argv[2];

if (!sql_query) {
	console.error('Usage: pnpm db:query "<SQL>"');
	process.exit(1);
}

const url = process.env.DATABASE_URL;
if (!url) {
	console.error('DATABASE_URL is not set');
	process.exit(1);
}

const client = postgres(url, { prepare: false });

try {
	const rows = await client.unsafe(sql_query);
	console.log(JSON.stringify(rows, null, 2));
	await client.end();
	process.exit(0);
} catch (err) {
	console.error(err instanceof Error ? err.message : String(err));
	await client.end();
	process.exit(1);
}
