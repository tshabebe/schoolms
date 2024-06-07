import { relations, sql } from "drizzle-orm";
import { pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { section } from "./classes";

export const student = pgTable("student", {
  id: serial("student_id").primaryKey(),
  studentName: serial("student_id"),
  sectionId: serial("section_id")
    .notNull()
    .references(() => section.id),
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
