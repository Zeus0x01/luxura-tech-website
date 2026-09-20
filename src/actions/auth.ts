"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";
import { loginSchema } from "@/lib/validation/auth";

export type LoginState = { error?: string; email?: string } | undefined;

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const rawEmail = typeof formData.get("email") === "string" ? (formData.get("email") as string) : "";
  const parsed = loginSchema.safeParse({
    email: rawEmail,
    password: formData.get("password"),
  });
  // React resets the form after an action; echo the email back so it is not lost.
  if (!parsed.success) return { error: "Enter your email address and password.", email: rawEmail };

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/admin", // fixed target: no open redirect
    });
  } catch (error) {
    if (error instanceof AuthError) {
      const code = (error as { code?: string }).code;
      if (code === "rate_limited") {
        return { error: "Too many sign-in attempts. Please wait a few minutes and try again.", email: parsed.data.email };
      }
      return { error: "Incorrect email or password.", email: parsed.data.email };
    }
    throw error; // the redirect after a successful sign-in is thrown by Next.js
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}
