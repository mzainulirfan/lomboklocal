export const WHATSAPP_NUMBER = "6281234567890";

export function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const waGeneral = () =>
  waLink("Hi Lombok Local, I'd like to plan a trip.");

export const waTour = (tour: string, date = "", guests = "") =>
  waLink(
    `Hi, I'd like to book:\n\n${tour}\n\nDate:\n${date || "-"}\n\nGuests:\n${guests || "-"} people`
  );

export const waScooter = (model: string, date = "", duration = "", pickup = "") =>
  waLink(
    `Hi, I'm interested in renting\na ${model}.\n\nDate:\n${date || "-"}\n\nDuration:\n${duration || "-"} days\n\nPickup:\n${pickup || "-"}`
  );

export const waTransfer = (from = "Lombok Airport", to = "", date = "", pax = "") =>
  waLink(
    `Hi, I'd like to request a transfer.\n\nFROM:\n${from}\n\nTO:\n${to || "-"}\n\nDATE:\n${date || "-"}\n\nPASSENGERS:\n${pax || "-"}`
  );
