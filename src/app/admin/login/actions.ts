"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { safeAdminNext } from "@/lib/redirects";

export type LoginState = { error?: string };

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

const DUMMY_HASH =
  "$2b$10$FZnkF7O6d6DALjgE2A1SjuQhsJrOwmj5O1bYLBA3E73wtEOOnDcAu";

const WINDOW = 15 * 60 * 1000;
const MAX_ATTEMPTS = 6;
const attempts = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const history = (attempts.get(key) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW,
  );
  history.push(now);
  attempts.set(key, history);

  if (attempts.size > 2000) {
    for (const [entry, timestamps] of attempts) {
      if (timestamps.every((timestamp) => now - timestamp > WINDOW)) {
        attempts.delete(entry);
      }
    }
  }

  return history.length > MAX_ATTEMPTS;
}

export async function loginAction(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerStore.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return {
      error:
        "Too many sign-in attempts. Please wait 15 minutes and try again.",
    };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Please enter a valid email and password." };
  }

  if (!process.env.DATABASE_URL) {
    return {
      error:
        "The studio database is not connected. Add DATABASE_URL, run the migrations and seed, then try again.",
    };
  }

  const { email, password } = parsed.data;

  try {
    const user = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase() },
    });

    const valid = user
      ? await bcrypt.compare(password, user.passwordHash)
      : await bcrypt.compare(password, DUMMY_HASH);

    if (!user || !valid) {
      return { error: "The email or password is incorrect." };
    }

    attempts.delete(ip);

    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    redirect(safeAdminNext(formData.get("next")));
  } catch (error) {
    if (
      error instanceof Error &&
      "digest" in error &&
      String((error as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    console.error("[ivory-oak] Admin sign-in failed", error);
    return {
      error: "We couldn't sign you in right now. Please try again shortly.",
    };
  }
}
