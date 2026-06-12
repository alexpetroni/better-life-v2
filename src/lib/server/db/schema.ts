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

export type Subscriber = typeof subscribers.$inferSelect;
export type NewSubscriber = typeof subscribers.$inferInsert;
export type QuizResult = typeof quiz_results.$inferSelect;
export type NewQuizResult = typeof quiz_results.$inferInsert;
export type EmailSend = typeof email_sends.$inferSelect;
export type NewEmailSend = typeof email_sends.$inferInsert;
