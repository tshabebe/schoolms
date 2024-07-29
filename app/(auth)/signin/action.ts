"use server";
import { Argon2id } from "oslo/password";
import { cookies } from "next/headers";
import { lucia } from "../authIntegration";
import { redirect } from "next/navigation";
import { db } from "@/app/_db";
import { userTable } from "@/app/_db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const signUpSchema = z.object({
  username: z.string().min(5, "Username must be at least 5 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function signIn(formData: FormData) {
  const data = Object.fromEntries(formData);
  const res = signUpSchema.safeParse(data);

  if (!res.success) return "invalid Input";
  const { username, password } = res.data;

  const existingUser = await db.query.userTable.findFirst({
    where: eq(userTable.username, username),
  });
  console.log(existingUser);
  if (!existingUser) {
    // NOTE:
    // Returning immediately allows malicious actors to figure out valid usernames from response times,
    // allowing them to only focus on guessing passwords in brute-force attacks. As a preventive measure, you may want to hash passwords even for invalid usernames.
    // However, valid usernames can be already be revealed with the signup page among other methods.
    // It will also be much more resource intensive.
    // Since protecting against this is none-trivial,
    // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
    // If usernames are public, you may outright tell the user that the username is invalid.
    return {
      error: "Incorrect username or password",
    };
  }

  const validPassword = await new Argon2id().verify(
    existingUser.password,
    password,
  );
  console.log(validPassword)

  if (!validPassword) {
    return {
      error: "Incorrect username or password",
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  console.log("testing");
  return redirect("/");
}
