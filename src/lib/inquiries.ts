export type InquiryType = "tour" | "vehicle" | "transfer" | "contact" | "custom";

export type InquiryInput = {
  type: InquiryType;
  title: string;
  name?: string;
  payload: Record<string, string>;
};

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
