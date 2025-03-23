// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { integer, sqliteTable, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `lc_note_${name}`);

export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  difficulty: text("difficulty", { enum: ["Easy", "Medium", "Hard"] }).notNull(),
  createdAt: integer("created_at").default(sql`(unixepoch())`).notNull(),
  updatedAt: integer("updated_at").default(sql`(unixepoch())`).notNull(),
});

export type Note = typeof notes.$inferSelect;
export type DifficultyLevel = "Easy" | "Medium" | "Hard";