import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./dashboard-client";
import type { Transaction } from "@/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profileData } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .single();

  const profile = profileData as { name: string } | null;

  const { data: txData } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  const name = profile?.name ?? (user.user_metadata?.name as string | undefined) ?? "usuário";

  return (
    <DashboardClient
      userName={name}
      transactions={(txData ?? []) as Transaction[]}
    />
  );
}
