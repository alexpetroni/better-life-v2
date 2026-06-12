import { boolean, integer, jsonb, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';


export const subscribers = pgTable('subscribers', {
	id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
	email: text('email').notNull().unique(),
	status: text('status').notNull().default('pending'),
	cadence: text('cadence').notNull().default('weekly'),
	locale: text('locale').notNull().default('ro'),
	primary_profile_key: text('primary_profile_key'),
	primary_quiz_slug: text('primary_quiz_slug'),
	created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	confirmed_at: timestamp('confirmed_at', { withTimezone: true }),
	unsubscribed_at: timestamp('unsubscribed_at', { withTimezone: true })
});

export const quiz_results = pgTable('quiz_results', {
	id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
	subscriber_id: uuid('subscriber_id').notNull().references(() => subscribers.id),
	quiz_slug: text('quiz_slug').notNull(),
	quiz_version: integer('quiz_version').notNull(),
	profile_key: text('profile_key').notNull(),
	answers: jsonb('answers').notNull(),
	scores: jsonb('scores').notNull(),
	created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const email_sends = pgTable('email_sends', {
	id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
	subscriber_id: uuid('subscriber_id').references(() => subscribers.id),
	recipient_email: text('recipient_email').notNull(),
	email_key: text('email_key').notNull(),
	status: text('status').notNull().default('pending'),
	resend_id: text('resend_id'),
	error: text('error'),
	sent_at: timestamp('sent_at', { withTimezone: true }),
	created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => ({
	unique_email_key: unique().on(table.recipient_email, table.email_key)
}));

export const products = pgTable('products', {
	id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
	slug: text('slug').notNull().unique(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	price_cents: integer('price_cents').notNull(),
	type: text('type').notNull(), // 'physical' | 'digital'
	topic: text('topic'),
	digital_file_key: text('digital_file_key'),
	image_url: text('image_url'),
	active: boolean('active').notNull().default(true),
	stripe_product_id: text('stripe_product_id'),
	stripe_price_id: text('stripe_price_id'),
	created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const orders = pgTable('orders', {
	id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
	stripe_session_id: text('stripe_session_id').notNull().unique(),
	email: text('email'),
	status: text('status').notNull().default('paid'),
	amount_total: integer('amount_total'),
	currency: text('currency'),
	shipping_address: jsonb('shipping_address'),
	created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const order_items = pgTable('order_items', {
	id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
	order_id: uuid('order_id').notNull().references(() => orders.id),
	product_id: uuid('product_id').notNull().references(() => products.id),
	quantity: integer('quantity').notNull(),
	unit_amount: integer('unit_amount').notNull(),
	type: text('type').notNull()
});

export const download_tokens = pgTable('download_tokens', {
	id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
	token: text('token').notNull().unique(),
	order_item_id: uuid('order_item_id').notNull().references(() => order_items.id),
	download_count: integer('download_count').notNull().default(0),
	max_downloads: integer('max_downloads').notNull().default(5),
	expires_at: timestamp('expires_at', { withTimezone: true }).notNull(),
	created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export type Subscriber = typeof subscribers.$inferSelect;
export type NewSubscriber = typeof subscribers.$inferInsert;
export type QuizResult = typeof quiz_results.$inferSelect;
export type NewQuizResult = typeof quiz_results.$inferInsert;
export type EmailSend = typeof email_sends.$inferSelect;
export type NewEmailSend = typeof email_sends.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof order_items.$inferSelect;
export type DownloadToken = typeof download_tokens.$inferSelect;
