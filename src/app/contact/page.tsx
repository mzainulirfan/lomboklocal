import type { Metadata } from "next";
import { Clock, MapPin, MessageCircle } from "lucide-react";
import { SiteHeader } from "@/components/layout";
import { Container, SectionLabel } from "@/components/ui";
import { getSiteSettings } from "@/lib/settings";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to a local in Lombok — fastest reply via WhatsApp.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <SiteHeader dark={false} />
      <main className="bg-sand pt-32">
        <Container className="pb-24">
          <SectionLabel>Contact</SectionLabel>
          <h1 className="display max-w-3xl text-5xl font-extrabold uppercase sm:text-7xl">
            Talk to a local.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-black/55">
            Fastest reply via WhatsApp. We usually answer within minutes during the day.
          </p>

          <div className="mt-12 grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
            <div className="space-y-4">
              <div className="rounded-3xl bg-white p-7">
                <p className="flex items-center gap-2 font-bold">
                  <MessageCircle size={17} /> WhatsApp
                </p>
                <p className="mt-2 text-sm text-black/55">
                  {settings.contact_phone_display} · {settings.contact_hours}
                </p>
              </div>
              <div className="rounded-3xl bg-white p-7">
                <p className="flex items-center gap-2 font-bold">
                  <MapPin size={17} /> Base
                </p>
                <p className="mt-2 text-sm text-black/55">{settings.base_location}</p>
              </div>
              <div className="rounded-3xl bg-white p-7">
                <p className="flex items-center gap-2 font-bold">
                  <Clock size={17} /> Hours
                </p>
                <p className="mt-2 text-sm text-black/55">Tours run daily · airport pickup 24h with booking</p>
              </div>
            </div>

            <ContactForm number={settings.whatsapp_number} />
          </div>
        </Container>
      </main>
    </>
  );
}
