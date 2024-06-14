import { relations, sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { student } from "./students";
import { teacher } from "./teachers";

export const section = pgTable("section", {
  id: serial("id").primaryKey(),
  department: serial("department_id")
    .notNull()
    .references(() => department.id),
  sectionDuration: timestamp("section_duration").notNull(),
  sectionName: varchar("section_name", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
});

export const department = pgTable("department", {
  id: serial("id").primaryKey(),
  department: varchar("department", { length: 256 }).notNull().unique(),
  departmentDuration: integer("department_duration").default(3).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
});

export const departmentRelation = relations(department, ({ many }) => ({
  section: many(section),
}));

export const sectionRelation = relations(section, ({ one, many }) => ({
  department: one(department, {
    fields: [section.department],
    references: [department.id],
  }),
  students: many(student),
  teachers: many(teacher),
}));

export const InsertDepartmentSchema = createInsertSchema(department, {
  department: zfd.text(z.string().max(20, "too long try to shorten it")),
  departmentDuration: zfd.numeric(),
}).omit({ id: true });

export const InsertSectionSchema = createInsertSchema(section, {
  sectionName: zfd.text(
    z.string().max(2, "className should not be more than 2 characters"),
  ),
}).omit({ sectionDuration: true, id: true });

export const SelectSectionSchema = createSelectSchema(section);
