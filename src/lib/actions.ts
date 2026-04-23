"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Member, Transaction } from "@/lib/types";

type MemberInput = Pick<Member, "name" | "country" | "country_code" | "currency" | "note">;
type TransactionInput = Pick<Transaction, "member_id" | "amount" | "currency" | "amount_usd" | "rate_used" | "date" | "note">;

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return supabase;
}

// ========== Members ==========

export async function addMember(data: MemberInput) {
  const supabase = await requireAuth();
  const { error } = await supabase.from("members").insert(data);
  if (error) throw error;
  revalidatePath("/");
}

export async function updateMember(id: string, data: Partial<MemberInput>) {
  const supabase = await requireAuth();
  const { error } = await supabase.from("members").update(data).eq("id", id);
  if (error) throw error;
  revalidatePath("/");
}

export async function deleteMember(id: string) {
  const supabase = await requireAuth();
  const { error } = await supabase.from("members").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/");
}

// ========== Transactions ==========

export async function addTransaction(data: TransactionInput) {
  const supabase = await requireAuth();
  const { error } = await supabase.from("transactions").insert(data);
  if (error) throw error;
  revalidatePath("/");
}

export async function updateTransaction(id: string, data: Partial<TransactionInput>) {
  const supabase = await requireAuth();
  const { error } = await supabase.from("transactions").update(data).eq("id", id);
  if (error) throw error;
  revalidatePath("/");
}

export async function deleteTransaction(id: string) {
  const supabase = await requireAuth();
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/");
}
