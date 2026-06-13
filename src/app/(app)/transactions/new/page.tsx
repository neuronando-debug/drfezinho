import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NewTransactionClient from "./new-transaction-client";

export default async function NewTransactionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <NewTransactionClient userId={user.id} />;
}
