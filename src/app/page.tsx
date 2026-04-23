import { createClient } from "@/lib/supabase/server";
import { fetchExchangeRates } from "@/lib/fx";
import Dashboard from "@/components/Dashboard";
import type { Member, Transaction } from "@/lib/types";

export const revalidate = 0; // Always fetch fresh data

export default async function HomePage() {
  const supabase = await createClient();
  
  // Check auth (optional - dashboard handles read-only vs admin UI)
  const { data: { user } } = await supabase.auth.getUser();
  
  // Fetch members and transactions
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
      isAuthenticated={!!user}
    />
  );
}
