import { relations, sql } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { section } from "./classes";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const student = pgTable("student", {
  id: serial("student_id").primaryKey(),
  studentName: varchar("student_name", { length: 256 }).notNull(),
  sectionId: serial("section_id")
    .notNull()
    .references(() => section.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
});

export const studentRelations = relations(student, ({ one }) => ({
  sectionId: one(section, {
    fields: [student.sectionId],
    references: [section.id],
  }),
}));

export const InsertStudentSchema = createInsertSchema(student, {
  studentName: z.string().max(256).min(2),
});
