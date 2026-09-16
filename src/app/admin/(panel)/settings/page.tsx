import { isSupabaseConfigured } from "@/lib/supabase";
import { getAllSettingsAdmin, SETTING_LABELS, DEFAULT_SETTINGS } from "@/lib/settings";
import { upsertSetting } from "../../actions";
import { PanelHeader, EmptyState, input, label } from "../ui";

export default async function SettingsPage() {
  const configured = isSupabaseConfigured();
  const rows = configured ? await getAllSettingsAdmin() : [];
  const known = Object.keys(SETTING_LABELS);
  const extra = rows.filter((r) => !known.includes(r.key));

  return (
    <>
      <PanelHeader
        kicker="Config"
        title="Settings."
        desc="Pengaturan global web. Nomor WhatsApp di sini dipakai oleh SEMUA tombol booking — ganti sekali, berlaku di mana-mana."
      />

      {!configured && (
        <div className="mt-8 rounded-3xl bg-coral/10 p-6 text-sm leading-7">
          <p className="font-bold">Supabase belum dikonfigurasi.</p>
        </div>
      )}

      {configured && (
        <div className="mt-8 space-y-3">
          {known.map((key) => {
            const current = rows.find((r) => r.key === key)?.value ?? DEFAULT_SETTINGS[key as keyof typeof DEFAULT_SETTINGS] ?? "";
            const meta = SETTING_LABELS[key];
            return (
              <form key={key} action={upsertSetting} className="grid items-end gap-3 rounded-3xl bg-white p-5 sm:grid-cols-[1fr_auto]">
                <input type="hidden" name="key" value={key} />
                <div>
                  <label className={label}>{meta.label}</label>
                  <input name="value" defaultValue={current} className={input} />
                  <p className="mt-1.5 text-xs text-black/40">{meta.hint}</p>
                </div>
                <button type="submit" className="rounded-full bg-ink px-5 py-3.5 text-sm font-bold text-white">
                  Simpan
                </button>
              </form>
            );
          })}
          {extra.map((r) => (
            <form key={r.key} action={upsertSetting} className="grid items-end gap-3 rounded-3xl bg-white p-5 sm:grid-cols-[1fr_auto]">
              <input type="hidden" name="key" value={r.key} />
              <div>
                <label className={label}>{r.key}</label>
                <input name="value" defaultValue={r.value} className={input} />
              </div>
              <button type="submit" className="rounded-full bg-ink px-5 py-3.5 text-sm font-bold text-white">
                Simpan
              </button>
            </form>
          ))}
          {rows.length === 0 && <EmptyState>Belum ada settings — run migrasi SQL (seed).</EmptyState>}
        </div>
      )}
    </>
  );
}
