"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifyPassword, isAuthConfigured } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/");

  if (!isAuthConfigured()) {
    redirect("/");
  }

  if (!verifyPassword(password)) {
    redirect(`/login?error=1&from=${encodeURIComponent(from)}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, process.env.SESSION_TOKEN!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  redirect(from.startsWith("/") ? from : "/");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/login");
}
