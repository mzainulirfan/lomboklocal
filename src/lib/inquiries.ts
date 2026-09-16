export type InquiryType = "tour" | "vehicle" | "transfer" | "contact" | "custom";

export type InquiryInput = {
  type: InquiryType;
  title: string;
  name?: string;
  /** Nomor WA pemesan (format bebas, dinormalisasi saat simpan). */
  phone?: string;
  payload: Record<string, string>;
};

/** "0812-3456..." / "+62..." → "62812...". Kosong bila tidak valid. */
export function normalizePhone(raw: string | undefined | null): string {
  if (!raw) return "";
  let d = String(raw).replace(/\D/g, "");
  if (d.startsWith("0")) d = "62" + d.slice(1);
  if (d.startsWith("620")) d = "62" + d.slice(3);
  return d.length >= 9 && d.length <= 15 ? d : "";
}

/** Bangun pesan WA dari payload inquiry (dipakai server action + fallback). */
export function buildInquiryMessage({ type, title, name, payload }: InquiryInput): string {
  const v = (k: string) => payload[k] || "-";
  switch (type) {
    case "tour":
      return `Hi, I'd like to book:\n\n${title}\n\nDate:\n${v("date")}\n\nGuests:\n${v("guests")} people`;
    case "vehicle":
      return `Hi, I'm interested in renting\na ${title}.\n\nDate:\n${v("date")}\n\nDuration:\n${v("duration")} days\n\nPickup:\n${v("pickup")}`;
    case "transfer":
      return `Hi, I'd like to request a transfer.\n\nFROM:\n${v("from")}\n\nTO:\n${v("to")}\n\nDATE:\n${v("date")}\n\nPASSENGERS:\n${v("pax")}`;
    case "contact":
      return `Hi Lombok Local, I'm ${name || "a traveler"}.\n\nTopic:\n${title}\n\nMessage:\n${v("message")}`;
    case "custom":
      return `Hi, I'd like to discuss this trip:\n\nDuration: ${v("duration")}\nStyle: ${v("style")}\nInterests: ${v("interests")}\n\n${v("plan")}`;
  }
}
