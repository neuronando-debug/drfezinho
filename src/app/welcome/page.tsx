import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import WelcomeClient from "./welcome-client";

export default async function WelcomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profileData } = await supabase
    .from("profiles")
    .select("name, onboarding_completed")
    .eq("id", user.id)
    .single();

  const profile = profileData as { name: string; onboarding_completed: boolean } | null;

  if (profile?.onboarding_completed) redirect("/dashboard");

  const name = profile?.name ?? (user.user_metadata?.name as string | undefined) ?? "usuário";

  return <WelcomeClient name={name} userId={user.id} />;
}
