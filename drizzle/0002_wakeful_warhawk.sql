ALTER TABLE "class" ALTER COLUMN "class_name" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "class" ADD CONSTRAINT "class_class_name_unique" UNIQUE("class_name");