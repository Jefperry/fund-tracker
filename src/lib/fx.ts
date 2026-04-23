import type { Currency, ExchangeRates } from "./types";

const FALLBACK_RATES: ExchangeRates = {
  USD: 1,
  EUR: 0.93,
  CHF: 0.88,
  CAD: 1.36,
  RUB: 92,
};

export async function fetchExchangeRates(): Promise<ExchangeRates> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) throw new Error("FX API failed");
    const data = await res.json();
    
    const rates: Partial<ExchangeRates> = {};
    (["USD", "EUR", "CHF", "CAD", "RUB"] as Currency[]).forEach((c) => {
      rates[c] = data.rates?.[c] ?? FALLBACK_RATES[c];
    });
    
    return rates as ExchangeRates;
  } catch {
    return FALLBACK_RATES;
  }
}

export function convertToUSD(amount: number, currency: Currency, rates: ExchangeRates): number {
  if (currency === "USD") return amount;
  const rate = rates[currency];
  if (!rate) return amount; // Fallback if rate missing
  return amount / rate;
}
