import { relations, sql } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { section } from "./classes";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const teacher = pgTable("teacher", {
  id: serial("teacher_id").primaryKey(),
  teacherName: varchar("teacher_name", { length: 256 }).notNull(),
  sectionId: serial("section_id")
    .notNull()
    .references(() => section.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
});

export const teachersRelations = relations(teacher, ({ one }) => ({
  sectionId: one(section, {
    fields: [teacher.sectionId],
    references: [section.id],
  }),
}));

export const InsertTeachersSchema = createInsertSchema(teacher, {});
