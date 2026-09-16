"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { submitInquiry } from "@/actions/inquiries";
import { waLink } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";

const durations = ["2 days", "3 days", "4 days", "5+ days"];
const interests = ["Beach", "Waterfall", "Surf", "Culture", "Food", "Snorkeling", "Adventure", "Relaxation"];
const styles = ["Budget", "Comfort", "Private", "Adventure"];

const suggestion: Record<string, string[]> = {
  Beach: ["South Lombok beaches + Merese Hill"],
  Waterfall: ["Sendang Gile + jungle walk"],
  Surf: ["Kuta beginner surf + Gerupuk"],
  Culture: ["Sasak village + market"],
  Food: ["Warung crawl + night market"],
  Snorkeling: ["Island boat + coral gardens"],
  Adventure: ["Hike + waterfall combo"],
  Relaxation: ["Slow beach day + sunset"],
};

const btn = "rounded-full border px-5 py-2.5 text-sm font-bold transition";

export function CustomTripPlanner({ number }: { number: string }) {
  const [duration, setDuration] = useState("3 days");
  const [picked, setPicked] = useState<string[]>(["Beach", "Snorkeling"]);
  const [style, setStyle] = useState("Private");
  const [busy, setBusy] = useState(false);

  const plan = useMemo(() => {
    const days = parseInt(duration, 10) || 5;
    const list = picked.length ? picked : ["Beach"];
    return Array.from({ length: Math.min(days, 7) }, (_, i) => ({
      day: i + 1,
      focus: suggestion[list[i % list.length]]?.[0] ?? list[i % list.length],
    }));
  }, [duration, picked]);

  function toggle(interest: string) {
    setPicked((p) => (p.includes(interest) ? p.filter((x) => x !== interest) : [...p, interest]));
  }

  const payload = {
    duration,
    style,
    interests: picked.join(", ") || "-",
    plan: plan.map((d) => `Day ${d.day}: ${d.focus}`).join("\n"),
  };
  const fallbackHref = waLink(
    `Hi, I'd like to discuss this trip:\n\nDuration: ${duration}\nStyle: ${style}\nInterests: ${payload.interests}\n\n${payload.plan}`,
    number
  );

  async function discuss() {
    if (busy) return;
    setBusy(true);
    try {
      const url = await submitInquiry({ type: "custom", title: `${duration} · ${style}`, payload });
      window.open(url, "_blank");
    } catch {
      window.open(fallbackHref, "_blank");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
      <div className="space-y-8 rounded-[2rem] bg-white p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-black/40">Duration</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {durations.map((d) => (
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
          <p className="text-xs font-bold uppercase tracking-widest text-black/40">Interests</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {interests.map((i) => (
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
          <p className="text-xs font-bold uppercase tracking-widest text-black/40">Travel style</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {styles.map((s) => (
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
          Your Lombok trip · {duration} · {style}
        </p>
        <div className="mt-6 space-y-4">
          {plan.map((d) => (
            <div key={d.day} className="rounded-2xl bg-white/5 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">Day {d.day}</p>
              <p className="mt-1 font-bold">{d.focus}</p>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={discuss}
          disabled={busy}
          className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-bold text-ink transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {busy ? "Membuka…" : <>Discuss this trip <ArrowUpRight size={16} className="ml-2" /></>}
        </button>
        <p className="mt-4 text-center text-xs text-white/40">
          Plan is drafted locally, confirmed via WhatsApp.
        </p>
      </div>
    </div>
  );
}
