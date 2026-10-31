// Money is stored as integer paise so sums never drift. Pure module: no imports.

// ₹10 crore ceiling keeps amount * basis-points inside Number's safe range.
const MAX_PAISE = 100_000_000 * 100;

// Parses a positive rupee amount (string or number, max 2 decimals) into paise.
export function toPaise(input: string | number): number | null {
  const str = typeof input === "number" ? String(input) : input.trim();
  if (!/^\d+(\.\d{1,2})?$/.test(str)) return null;
  const [rupees, fraction = ""] = str.split(".");
  const paise = Number(rupees) * 100 + Number(fraction.padEnd(2, "0"));
  if (!Number.isSafeInteger(paise) || paise <= 0 || paise > MAX_PAISE) {
    return null;
  }
  return paise;
}

export function formatINR(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(paise / 100);
}

export interface DirectorBps {
  id: string;
  bps: number;
}

// Splits a payment between directors and the company. Basis points must total
// 10000. Each director gets the floor of their share; the company keeps the
// remainder, so the parts always add up to the payment exactly.
export function splitPaise(
  totalPaise: number,
  companyBps: number,
  directors: DirectorBps[],
): { companyPaise: number; shares: Array<{ id: string; paise: number }> } {
  const bpsTotal = directors.reduce((s, d) => s + d.bps, companyBps);
  if (bpsTotal !== 10000) {
    throw new Error("Split percentages must total 100%");
  }
  const shares = directors.map((d) => ({
    id: d.id,
    paise: Math.floor((totalPaise * d.bps) / 10000),
  }));
  const companyPaise =
    totalPaise - shares.reduce((s, share) => s + share.paise, 0);
  return { companyPaise, shares };
}
