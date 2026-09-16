"use server";

import { cookies } from "next/headers";
import { COOKIE, type Locale } from "@/i18n/dictionaries";

export async function setLocale(locale: Locale) {
  const store = await cookies();
  store.set(COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
}
