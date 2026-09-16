"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { submitInquiry } from "@/actions/inquiries";
import { waLink } from "@/lib/whatsapp";

export type ContactLabels = {
  name: string;
  topic: string;
  message: string;
  namePh: string;
  msgPh: string;
  phone: string;
  phonePh: string;
  refCode: string;
  refHint: string;
  submit: string;
  opening: string;
  topics: string[];
};

export function ContactForm({ number, labels }: { number: string; labels: ContactLabels }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState(labels.topics[0]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [ref, setRef] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const win = window.open("about:blank", "_blank");
    const go = (url: string) => {
      if (win && !win.closed) win.location.href = url;
      else window.location.href = url;
    };
    try {
      const { url, refCode } = await submitInquiry({
        type: "contact",
        title: topic,
        name: name || undefined,
        phone,
        payload: { message },
      });
      setRef(refCode);
      go(url);
    } catch {
      go(
        waLink(`Hi Lombok Local, I'm ${name || "a traveler"}.\n\nTopic:\n${topic}\n\nMessage:\n${message || "-"}`, number)
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
        {labels.name}
      </label>
      <input
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={labels.namePh}
        className={input}
      />
      <label htmlFor="cphone" className="mt-6 block text-xs font-bold uppercase tracking-widest text-black/40">
        {labels.phone}
      </label>
      <input
        id="cphone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder={labels.phonePh}
        className={input}
      />
      <label htmlFor="topic" className="mt-6 block text-xs font-bold uppercase tracking-widest text-black/40">
        {labels.topic}
      </label>
      <select
        id="topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className={`${input} bg-white font-bold`}
      >
        {labels.topics.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>
      <label htmlFor="msg" className="mt-6 block text-xs font-bold uppercase tracking-widest text-black/40">
        {labels.message}
      </label>
      <textarea
        id="msg"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={5}
        placeholder={labels.msgPh}
        className={input}
      />
      {ref && (
        <p role="status" className="mt-6 rounded-2xl bg-ocean/10 px-4 py-3.5 text-sm leading-6">
          <span className="font-extrabold">{labels.refCode}: {ref}</span>
          <span className="block font-normal text-black/55">{labels.refHint}</span>
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-ink px-7 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-60"
      >
        {busy ? labels.opening : <>{labels.submit} <ArrowUpRight size={16} className="ml-2" /></>}
      </button>
    </form>
  );
}
