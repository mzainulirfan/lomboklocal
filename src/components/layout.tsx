import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { waGeneral } from "@/lib/whatsapp";
import { getSiteSettings, getWhatsappNumber } from "@/lib/settings";
import { MobileMenu } from "@/components/MobileMenu";
import { LocaleToggle } from "@/components/LocaleToggle";
import { getDict, getLocale } from "@/i18n/dictionaries";

export async function SiteHeader({ dark = true }: { dark?: boolean }) {
  const number = await getWhatsappNumber();
  const locale = await getLocale();
  const t = getDict(locale);
  const menuLinks = [
    { href: "/tours", label: t.nav.tours },
    { href: "/rental/scooter", label: `${t.nav.rental} · Scooter` },
    { href: "/rental/car", label: `${t.nav.rental} · Car` },
    { href: "/experiences", label: t.nav.experiences },
    { href: "/transfer", label: t.nav.transfer },
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.contact.label },
    { href: "/faq", label: t.faqPage.label },
    { href: "/blog", label: t.blog.label },
  ];
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          className={`text-lg font-extrabold tracking-tight ${dark ? "text-white" : "text-ink"}`}
        >
          LOMBOK<span className="font-normal">LOCAL</span>
        </Link>
        <nav
          className={`hidden items-center gap-8 text-sm font-medium md:flex ${
            dark ? "text-white/90" : "text-ink/70"
          }`}
        >
          <Link href="/tours" className="transition hover:opacity-70">{t.nav.tours}</Link>
          <Link href="/rental/scooter" className="transition hover:opacity-70">{t.nav.rental}</Link>
          <Link href="/experiences" className="transition hover:opacity-70">{t.nav.experiences}</Link>
          <Link href="/transfer" className="transition hover:opacity-70">{t.nav.transfer}</Link>
          <Link href="/about" className="transition hover:opacity-70">{t.nav.about}</Link>
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <LocaleToggle current={locale} dark={dark} />
          <a
            href={waGeneral(number)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white px-5 py-3 text-sm font-bold text-ink transition hover:bg-white/90"
          >
            {t.header.book}
          </a>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <LocaleToggle current={locale} dark={dark} />
          <MobileMenu dark={dark} bookHref={waGeneral(number)} links={menuLinks} openLabel={t.menu.open} closeLabel={t.menu.close} navLabel={t.menu.navLabel} bookLabel={t.menu.book} />
        </div>
      </div>
    </header>
  );
}

export async function SiteFooter() {
  const settings = await getSiteSettings();
  const number = settings.whatsapp_number;
  const t = getDict(await getLocale());
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div>
            <div className="text-lg font-extrabold tracking-tight">
              LOMBOK<span className="font-normal">LOCAL</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-6 text-white/40">
              {t.footer.tagline}
            </p>
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-white/35">
              {t.footer.location}
            </p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60">
              <Link href="/tours" className="hover:text-white">Tours</Link>
              <Link href="/tours/custom-trip" className="hover:text-white">Custom trip</Link>
              <Link href="/rental/scooter" className="hover:text-white">Scooter</Link>
              <Link href="/rental/car" className="hover:text-white">Car</Link>
              <Link href="/transfer" className="hover:text-white">Transfer</Link>
              <Link href="/experiences" className="hover:text-white">Experiences</Link>
              <Link href="/about" className="hover:text-white">About</Link>
              <Link href="/contact" className="hover:text-white">Contact</Link>
              <Link href="/faq" className="hover:text-white">FAQ</Link>
              <Link href="/blog" className="hover:text-white">Blog</Link>
            </div>
          </div>
          <div className="flex gap-10 text-sm text-white/60">
            {settings.instagram_url ? (
              <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
            ) : null}
            <a href={waGeneral(number)} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a>
            {settings.google_maps_url ? (
              <a href={settings.google_maps_url} target="_blank" rel="noopener noreferrer" className="hover:text-white">Google Maps</a>
            ) : null}
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-white/30">
          © 2026 Lombok Local. Explore responsibly.
        </div>
      </div>
    </footer>
  );
}

export async function MobileCTA() {
  const number = await getWhatsappNumber();
  const t = getDict(await getLocale());
  return (
    <div className="fixed inset-x-4 bottom-4 z-50 md:hidden">
      <a
        href={waGeneral(number)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between rounded-full bg-ink px-6 py-4 text-sm font-bold text-white shadow-2xl"
      >
        <span>{t.mobileCta}</span>
        <ArrowUpRight size={18} />
      </a>
    </div>
  );
}
