import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/layout";
import { Container, SectionLabel } from "@/components/ui";
import { isAdmin, login } from "../actions";
import { PasswordInput } from "./PasswordInput";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

const input =
  "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 pr-12 text-ink placeholder:text-black/30";

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdmin()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <>
      <SiteHeader dark={false} />
      <main className="bg-sand pt-32">
        <Container className="max-w-md pb-24">
          <SectionLabel>Admin</SectionLabel>
          <h1 className="display text-5xl font-extrabold uppercase">Login.</h1>
          <form action={login} className="mt-8 rounded-[2rem] bg-white p-8">
            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-black/40">
              Password admin
            </label>
            <PasswordInput className={input} />
            {error && (
              <p className="mt-3 text-sm font-bold text-coral">Password salah, coba lagi.</p>
            )}
            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-ink px-7 py-4 text-sm font-bold text-white"
            >
              Masuk
            </button>
          </form>
        </Container>
      </main>
    </>
  );
}
