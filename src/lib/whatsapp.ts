export const WHATSAPP_NUMBER = "6281234567890";

/** `number` opsional agar bisa di-override dari DB (site_settings). */
export function waLink(message: string, number = WHATSAPP_NUMBER) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const waGeneral = (number = WHATSAPP_NUMBER) =>
  waLink("Hi Lombok Local, I'd like to plan a trip.", number);

export const waTour = (tour: string, date = "", guests = "", number = WHATSAPP_NUMBER) =>
  waLink(
    `Hi, I'd like to book:\n\n${tour}\n\nDate:\n${date || "-"}\n\nGuests:\n${guests || "-"} people`,
    number
  );

export const waScooter = (
  model: string,
  date = "",
  duration = "",
  pickup = "",
  number = WHATSAPP_NUMBER
) =>
  waLink(
    `Hi, I'm interested in renting\na ${model}.\n\nDate:\n${date || "-"}\n\nDuration:\n${duration || "-"} days\n\nPickup:\n${pickup || "-"}`,
    number
  );

export const waTransfer = (
  from = "Lombok Airport",
  to = "",
  date = "",
  pax = "",
  number = WHATSAPP_NUMBER
) =>
  waLink(
    `Hi, I'd like to request a transfer.\n\nFROM:\n${from}\n\nTO:\n${to || "-"}\n\nDATE:\n${date || "-"}\n\nPASSENGERS:\n${pax || "-"}`,
    number
  );
