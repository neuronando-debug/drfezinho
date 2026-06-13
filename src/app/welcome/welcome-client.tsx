"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard, Loader2 } from "lucide-react";

interface WelcomeClientProps {
  name: string;
  userId: string;
}

export default function WelcomeClient({ name, userId }: WelcomeClientProps) {
  const [loading, setLoading] = useState<"add" | "explore" | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function completeOnboarding(destination: "/transactions/new" | "/dashboard") {
    setLoading(destination === "/transactions/new" ? "add" : "explore");

    await supabase
      .from("profiles")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .update({ onboarding_completed: true } as any)
      .eq("id", userId);

    router.push(destination);
  }

  const firstName = name.split(" ")[0];

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg text-center space-y-8">
        <div className="space-y-4">
          <div className="text-8xl">💰</div>
          <h1 className="text-4xl font-bold text-foreground">
            Bem-vindo ao FinanceApp, {firstName}!
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Seu controle financeiro começa agora.{" "}
            <span className="text-foreground font-medium">
              Leve menos de 30 segundos
            </span>{" "}
            para lançar sua primeira transação.
          </p>
        </div>

        <div className="grid gap-4 pt-4">
          <div className="bg-card border rounded-xl p-6 text-left space-y-3">
            <div className="flex items-center gap-3">
              <div className="text-3xl">📊</div>
              <div>
                <h3 className="font-semibold text-foreground">O que você pode fazer</h3>
                <p className="text-sm text-muted-foreground">Registre e acompanhe seu dinheiro</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Lançar receitas e despesas
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Ver seu saldo mensal em tempo real
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Analisar gastos por categoria
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Gráficos de evolução financeira
              </li>
            </ul>
          </div>

          <Button
            size="lg"
            className="w-full h-14 text-base font-semibold"
            onClick={() => completeOnboarding("/transactions/new")}
            disabled={!!loading}
          >
            {loading === "add" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ArrowRight className="h-5 w-5" />
            )}
            Adicionar primeira transação
          </Button>

          <Button
            variant="ghost"
            className="w-full text-muted-foreground hover:text-foreground"
            onClick={() => completeOnboarding("/dashboard")}
            disabled={!!loading}
          >
            {loading === "explore" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LayoutDashboard className="h-4 w-4" />
            )}
            Explorar o painel primeiro
          </Button>
        </div>
      </div>
    </div>
  );
}
