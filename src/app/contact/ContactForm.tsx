"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { submitInquiry } from "@/actions/inquiries";
import { waLink } from "@/lib/whatsapp";

const topics = ["Tour", "Scooter rental", "Car rental", "Airport transfer", "Custom trip", "Other"];

export function ContactForm({ number }: { number: string }) {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("Tour");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const url = await submitInquiry({
        type: "contact",
        title: topic,
        name: name || undefined,
        payload: { message },
      });
      window.open(url, "_blank");
    } catch {
      window.open(
        waLink(`Hi Lombok Local, I'm ${name || "a traveler"}.\n\nTopic:\n${topic}\n\nMessage:\n${message || "-"}`, number),
        "_blank"
      );
    } finally {
      setBusy(false);
    }
  }

  const input =
    "mt-2 w-full rounded-2xl border border-black/10 px-4 py-3.5";

  return (
    <form className="rounded-[2rem] bg-white p-8" onSubmit={onSubmit}>
      <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-black/40">
        Your name
      </label>
      <input
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Sarah"
        className={input}
      />
      <label htmlFor="topic" className="mt-6 block text-xs font-bold uppercase tracking-widest text-black/40">
        Topic
      </label>
      <select
        id="topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className={`${input} bg-white font-bold`}
      >
        {topics.map((t) => (
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
        className={input}
      />
      <button
        type="submit"
        disabled={busy}
        className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-ink px-7 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-60"
      >
        {busy ? "Membuka…" : <>Send via WhatsApp <ArrowUpRight size={16} className="ml-2" /></>}
      </button>
    </form>
  );
}
