"use client";

import { useState } from "react";
import { ArrowUpRight, Clock, MapPin, MessageCircle } from "lucide-react";
import { SiteHeader } from "@/components/layout";
import { Container, SectionLabel } from "@/components/ui";
import { waLink } from "@/lib/whatsapp";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("Tour");
  const [message, setMessage] = useState("");

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
                <p className="mt-2 text-sm text-black/55">+62 812-3456-7890 · daily 07:00–21:00 WITA</p>
              </div>
              <div className="rounded-3xl bg-white p-7">
                <p className="flex items-center gap-2 font-bold">
                  <MapPin size={17} /> Base
                </p>
                <p className="mt-2 text-sm text-black/55">Kuta, South Lombok · delivery & pickup available</p>
              </div>
              <div className="rounded-3xl bg-white p-7">
                <p className="flex items-center gap-2 font-bold">
                  <Clock size={17} /> Hours
                </p>
                <p className="mt-2 text-sm text-black/55">Tours run daily · airport pickup 24h with booking</p>
              </div>
            </div>

            <form
              className="rounded-[2rem] bg-white p-8"
              onSubmit={(e) => {
                e.preventDefault();
                window.open(
                  waLink(`Hi Lombok Local, I'm ${name || "a traveler"}.\n\nTopic:\n${topic}\n\nMessage:\n${message || "-"}`),
                  "_blank"
                );
              }}
            >
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-black/40">
                Your name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sarah"
                className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3.5"
              />
              <label htmlFor="topic" className="mt-6 block text-xs font-bold uppercase tracking-widest text-black/40">
                Topic
              </label>
              <select
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 font-bold"
              >
                {["Tour", "Scooter rental", "Car rental", "Airport transfer", "Custom trip", "Other"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <label htmlFor="msg" className="mt-6 block text-xs font-bold uppercase tracking-widest text-black/40">
                Message
              </label>
              <textarea
                id="msg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Hi! We're 2 people arriving 20 Sep, want..."
                className="mt-2 w-full rounded-2xl border border-black/10 px-4 py-3.5"
              />
              <button
                type="submit"
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-ink px-7 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5"
              >
                Send via WhatsApp <ArrowUpRight size={16} className="ml-2" />
              </button>
            </form>
          </div>
        </Container>
      </main>
    </>
  );
}
