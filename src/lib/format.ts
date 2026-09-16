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

/** 1200000 @16000 → "≈ $75". Hint kasar untuk turis asing. */
export function formatUSD(idr: number | null | undefined, rate: number): string | null {
  if (idr == null || !rate) return null;
  const usd = idr / rate;
  return `≈ $${usd >= 100 ? Math.round(usd).toString() : (Math.round(usd * 10) / 10).toString()}`;
}
