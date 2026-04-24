import { createClient } from "@/lib/supabase/server";
import { fetchExchangeRates } from "@/lib/fx";
import Dashboard from "@/components/Dashboard";
import type { Member, Transaction } from "@/lib/types";

export const revalidate = 0;

export default async function ViewPage() {
  const supabase = await createClient();

  const [
    { data: members },
    { data: transactions },
    rates,
  ] = await Promise.all([
    supabase.from("members").select("*").order("added_at", { ascending: true }),
    supabase.from("transactions").select("*").order("created_at", { ascending: false }),
    fetchExchangeRates(),
  ]);

  return (
    <Dashboard
      initialMembers={(members as Member[]) ?? []}
      initialTransactions={(transactions as Transaction[]) ?? []}
      initialRates={rates}
      isAuthenticated={false}
    />
  );
}
