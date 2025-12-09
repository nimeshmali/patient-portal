import { pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const documents = pgTable('documents', {
    id: serial('id').primaryKey(),
    filename: varchar('filename', { length: 255 }).notNull(),
    filepath: varchar('filepath', { length: 500 }).notNull(),
    filesize: integer('filesize').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;