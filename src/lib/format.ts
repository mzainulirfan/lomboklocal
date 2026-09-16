/** 75000 → "Rp 75K", 650000 → "Rp 650K", 1500000 → "Rp 1.5M" */
export function formatRp(value: number | null | undefined): string {
  if (value == null) return "-";
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `Rp ${Number.isInteger(m) ? m : m.toFixed(1)}M`;
  }
  if (value >= 1000) {
    const k = value / 1000;
    return `Rp ${Number.isInteger(k) ? k : k.toFixed(1)}K`;
  }
  return `Rp ${value.toLocaleString("id-ID")}`;
}
