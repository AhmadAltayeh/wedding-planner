import { cookies } from "next/headers";

export const SESSION_COOKIE = "wedding_auth";

export function getSessionToken(): string | undefined {
  return process.env.SESSION_TOKEN;
}

export function isAuthConfigured(): boolean {
  return Boolean(process.env.APP_PASSWORD && process.env.SESSION_TOKEN);
}

export async function isAuthenticated(): Promise<boolean> {
  if (!isAuthConfigured()) return true;
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value === process.env.SESSION_TOKEN;
}

export function verifyPassword(password: string): boolean {
  return password === process.env.APP_PASSWORD;
}
