import { relations } from "drizzle-orm";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const section = pgTable("section", {
  id: serial("id").primaryKey(),
  department: serial("department_id")
    .notNull()
    .references(() => department.id),
  sectionName: varchar("section_name", { length: 256 }).notNull().unique(),
});

export const department = pgTable("department", {
  id: serial("id").primaryKey(),
  department: varchar("department", { length: 256 }).notNull().unique(),
});

export const departmentRelation = relations(department, ({ many }) => ({
  section: many(section),
}));

export const sectionRelation = relations(section, ({ one }) => ({
  department: one(department, {
    fields: [section.department],
    references: [department.id],
  }),
}));

export const InsertDepartmentSchema = createInsertSchema(department, {
  department: zfd.text(z.string().max(20, "too long try to shorten it")),
}).omit({ id: true });

export const InsertSectionSchema = createInsertSchema(section, {
  sectionName: zfd.text(
    z.string().max(2, "className should not be more than 2 characters"),
  ),
}).omit({ id: true });

export const SelectSectionSchema = createInsertSchema(section);
