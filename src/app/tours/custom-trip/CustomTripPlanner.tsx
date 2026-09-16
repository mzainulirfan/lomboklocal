"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { submitInquiry } from "@/actions/inquiries";
import { waLink } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";
import type { Dict } from "@/i18n/dictionaries";

const btn = "rounded-full border px-5 py-2.5 text-sm font-bold transition";

export function CustomTripPlanner({
  number,
  t,
  phoneLabel,
  phonePh,
}: {
  number: string;
  t: Dict["custom"];
  phoneLabel: string;
  phonePh: string;
}) {
  const [duration, setDuration] = useState(t.durations[1]);
  const [picked, setPicked] = useState<string[]>([t.interestsList[0], t.interestsList[5]]);
  const [style, setStyle] = useState(t.styles[2]);
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);

  const plan = useMemo(() => {
    const days = parseInt(duration, 10) || 5;
    const list = picked.length ? picked : [t.interestsList[0]];
    return Array.from({ length: Math.min(days, 7) }, (_, i) => {
      const interest = list[i % list.length];
      const idx = t.interestsList.indexOf(interest);
      return { day: i + 1, focus: idx >= 0 ? t.suggestions[idx] : interest };
    });
  }, [duration, picked, t]);

  function toggle(interest: string) {
    setPicked((p) => (p.includes(interest) ? p.filter((x) => x !== interest) : [...p, interest]));
  }

  const payload = {
    duration,
    style,
    interests: picked.join(", ") || "-",
    plan: plan.map((d) => `${t.day} ${d.day}: ${d.focus}`).join("\n"),
  };
  const fallbackHref = waLink(
    `Hi, I'd like to discuss this trip:\n\nDuration: ${duration}\nStyle: ${style}\nInterests: ${payload.interests}\n\n${payload.plan}`,
    number
  );

  async function discuss() {
    if (busy) return;
    setBusy(true);
    const win = window.open("about:blank", "_blank");
    const go = (url: string) => {
      if (win && !win.closed) win.location.href = url;
      else window.location.href = url;
    };
    try {
      const url = await submitInquiry({ type: "custom", title: `${duration} · ${style}`, phone, payload });
      go(url);
    } catch {
      go(fallbackHref);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
      <div className="space-y-8 rounded-[2rem] bg-white p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-black/40">{t.duration}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {t.durations.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className={cn(btn, duration === d ? "border-ink bg-ink text-white" : "border-black/10 hover:border-ink")}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-black/40">{t.interests}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {t.interestsList.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggle(i)}
                className={cn(btn, picked.includes(i) ? "border-ocean bg-ocean text-white" : "border-black/10 hover:border-ocean")}
              >
                {i}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-black/40">{t.style}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {t.styles.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStyle(s)}
                className={cn(btn, style === s ? "border-ink bg-ink text-white" : "border-black/10 hover:border-ink")}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] bg-ink p-8 text-white lg:sticky lg:top-8 lg:self-start">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/40">
          {t.planFor} · {duration} · {style}
        </p>
        <div className="mt-6 space-y-4">
          {plan.map((d) => (
            <div key={d.day} className="rounded-2xl bg-white/5 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">{t.day} {d.day}</p>
              <p className="mt-1 font-bold">{d.focus}</p>
            </div>
          ))}
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/40">{phoneLabel}</p>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={phonePh}
            className="mt-3 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white placeholder:text-white/30 [color-scheme:dark]"
          />
        </div>
        <button
          type="button"
          onClick={discuss}
          disabled={busy}
          className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-bold text-ink transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {busy ? t.opening : <>{t.discuss} <ArrowUpRight size={16} className="ml-2" /></>}
        </button>
        <p className="mt-4 text-center text-xs text-white/40">
          {t.note}
        </p>
      </div>
    </div>
  );
}
