process.loadEnvFile();

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle',
	dbCredentials: {
		// Migrations need a direct (session-mode) connection. On Neon, DATABASE_URL
		// is the pooled (-pooler / transaction-mode) endpoint, which cannot run
		// migrations; set DIRECT_DATABASE_URL to the direct endpoint. Locally there
		// is no pooler, so it falls back to DATABASE_URL.
		url: process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL!
	}
});
