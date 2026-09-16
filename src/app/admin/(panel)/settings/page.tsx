import { Camera, Clock, DollarSign, Image as ImageIcon, MapPin, Navigation, Phone, SlidersHorizontal, Type } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getAllSettingsAdmin, SETTING_LABELS, DEFAULT_SETTINGS } from "@/lib/settings";
import { upsertSetting } from "../../actions";
import { PanelHeader, EmptyState, input, label } from "../ui";
import { Flash } from "../Flash";

const groups: { title: string; keys: string[] }[] = [
  { title: "Kontak & WhatsApp", keys: ["whatsapp_number", "contact_phone_display", "contact_hours", "base_location"] },
  { title: "Tampilan web", keys: ["hero_image_url", "hero_image_alt", "instagram_url", "google_maps_url"] },
  { title: "Lanjutan", keys: ["usd_rate"] },
];

const icons: Record<string, typeof Phone> = {
  whatsapp_number: Phone,
  contact_phone_display: Phone,
  contact_hours: Clock,
  base_location: MapPin,
  instagram_url: Camera,
  google_maps_url: Navigation,
  usd_rate: DollarSign,
  hero_image_url: ImageIcon,
  hero_image_alt: Type,
};

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const { error, saved } = await searchParams;
  const configured = isSupabaseConfigured();
  const rows = configured ? await getAllSettingsAdmin() : [];
  const known = Object.keys(SETTING_LABELS);
  const extra = rows.filter((r) => !known.includes(r.key));
  const valueOf = (key: string) =>
    rows.find((r) => r.key === key)?.value ?? DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS] ?? "";

  return (
    <>
      <PanelHeader
        kicker="Config"
        title="Settings."
        desc="Pengaturan global web. Nomor WhatsApp di sini dipakai oleh SEMUA tombol booking — ganti sekali, berlaku di mana-mana."
      />

      <Flash error={error} saved={saved} />

      {!configured && (
        <div className="mt-8 rounded-3xl bg-coral/10 p-6 text-sm leading-7">
          <p className="font-bold">Supabase belum dikonfigurasi.</p>
        </div>
      )}

      {configured && (
        <>
          {groups.map((g) => (
            <section key={g.title} className="mt-8">
              <h2 className="mb-3 text-sm font-extrabold uppercase tracking-widest text-black/40">
                {g.title}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {g.keys.filter((key) => known.includes(key)).map((key) => {
                  const current = valueOf(key);
                  const meta = SETTING_LABELS[key];
                  const Icon = icons[key] ?? SlidersHorizontal;
                  return (
                    <form key={key} action={upsertSetting} className="flex flex-col rounded-[1.75rem] bg-white p-5">
                      <input type="hidden" name="key" value={key} />
                      <p className="flex items-center gap-2 font-extrabold">
                        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sand text-ocean">
                          <Icon size={17} />
                        </span>
                        {meta.label}
                      </p>
                      <div className="mt-4 flex-1">
                        <label className={label}>Nilai</label>
                        <input name="value" defaultValue={current} className={input} />
                        <p className="mt-1.5 text-xs leading-5 text-black/40">{meta.hint}</p>
                      </div>
                      <button type="submit" className="mt-4 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white transition hover:bg-black">
                        Simpan
                      </button>
                    </form>
                  );
                })}
              </div>
            </section>
          ))}

          {extra.length > 0 && (
            <div className="mt-4 space-y-3">
              {extra.map((r) => (
                <form key={r.key} action={upsertSetting} className="grid items-end gap-3 rounded-3xl bg-white p-5 sm:grid-cols-[1fr_auto]">
                  <input type="hidden" name="key" value={r.key} />
                  <div>
                    <label className={label}>{r.key}</label>
                    <input name="value" defaultValue={r.value} className={input} />
                  </div>
                  <button type="submit" className="rounded-full bg-ink px-5 py-3.5 text-sm font-bold text-white transition hover:bg-black">
                    Simpan
                  </button>
                </form>
              ))}
            </div>
          )}

          {rows.length === 0 && (
            <div className="mt-8">
              <EmptyState>Belum ada settings — run migrasi SQL (seed).</EmptyState>
            </div>
          )}
        </>
      )}
    </>
  );
}
