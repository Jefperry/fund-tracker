export type Member = {
  id: string;
  name: string;
  country: string;
  country_code: string;
  currency: string;
  note: string | null;
  added_at: string;
};

export type Transaction = {
  id: string;
  member_id: string;
  amount: number;
  currency: string;
  amount_usd: number;
  rate_used: number | null;
  date: string;
  note: string | null;
  created_at: string;
};

export type Country = {
  name: string;
  code: string;
  currency: string;
  flag: string;
};

export const COUNTRIES: Country[] = [
  { name: "Switzerland", code: "CH", currency: "CHF", flag: "🇨🇭" },
  { name: "Germany", code: "DE", currency: "EUR", flag: "🇩🇪" },
  { name: "Russia", code: "RU", currency: "RUB", flag: "🇷🇺" },
  { name: "United States", code: "US", currency: "USD", flag: "🇺🇸" },
  { name: "Canada", code: "CA", currency: "CAD", flag: "🇨🇦" },
];

export const CURRENCIES = ["USD", "EUR", "CHF", "CAD", "RUB"] as const;
export type Currency = typeof CURRENCIES[number];

export type ExchangeRates = Record<Currency, number>;
