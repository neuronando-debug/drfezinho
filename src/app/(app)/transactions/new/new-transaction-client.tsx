"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TransactionType, TransactionCategory } from "@/types/database";

const INCOME_CATEGORIES: { value: TransactionCategory; label: string }[] = [
  { value: "salary", label: "Salário" },
  { value: "freelance", label: "Freelance" },
  { value: "investment", label: "Investimentos" },
  { value: "other", label: "Outros" },
];

const EXPENSE_CATEGORIES: { value: TransactionCategory; label: string }[] = [
  { value: "food", label: "Alimentação" },
  { value: "transport", label: "Transporte" },
  { value: "health", label: "Saúde" },
  { value: "education", label: "Educação" },
  { value: "entertainment", label: "Lazer" },
  { value: "housing", label: "Moradia" },
  { value: "utilities", label: "Contas" },
  { value: "clothing", label: "Vestuário" },
  { value: "other", label: "Outros" },
];

interface NewTransactionClientProps {
  userId: string;
}

export default function NewTransactionClient({ userId }: NewTransactionClientProps) {
  const [type, setType] = useState<TransactionType>("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<TransactionCategory | "">("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function formatCurrencyInput(value: string) {
    // Remove tudo que não é número
    const cleaned = value.replace(/\D/g, "");

    if (!cleaned) return "";

    // Sempre mostra com 2 casas decimais
    // Ex: "5" → "0,05", "50" → "0,50", "500" → "5,00", "5000" → "50,00"
    const padded = cleaned.padStart(3, "0");
    const integerPart = padded.slice(0, -2);
    const decimalPart = padded.slice(-2);

    return `${integerPart || "0"},${decimalPart}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category) return;

    const parsedAmount = parseFloat(amount.replace(",", "."));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({ variant: "destructive", title: "Valor inválido", description: "Insira um valor maior que zero." });
      return;
    }

    setLoading(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.from("transactions").insert({
      user_id: userId,
      type,
      description,
      amount: parsedAmount,
      category,
      date,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    if (error) {
      toast({ variant: "destructive", title: "Erro ao salvar", description: error.message });
      setLoading(false);
      return;
    }

    toast({ title: "Transação salva!", description: `${type === "income" ? "Receita" : "Despesa"} registrada com sucesso.` });
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex-1 p-6 max-w-lg mx-auto w-full">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </button>

      <Card>
        <CardHeader>
          <CardTitle>Nova Transação</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { setType("income"); setCategory(""); }}
                  className={cn(
                    "flex items-center justify-center gap-2 p-3 rounded-lg border-2 text-sm font-medium transition-all",
                    type === "income"
                      ? "border-green-500 bg-green-500/10 text-green-500"
                      : "border-border text-muted-foreground hover:border-green-500/50"
                  )}
                >
                  <TrendingUp className="h-4 w-4" />
                  Receita
                </button>
                <button
                  type="button"
                  onClick={() => { setType("expense"); setCategory(""); }}
                  className={cn(
                    "flex items-center justify-center gap-2 p-3 rounded-lg border-2 text-sm font-medium transition-all",
                    type === "expense"
                      ? "border-red-500 bg-red-500/10 text-red-500"
                      : "border-border text-muted-foreground hover:border-red-500/50"
                  )}
                >
                  <TrendingDown className="h-4 w-4" />
                  Despesa
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                placeholder="Ex: Almoço, Salário mensal..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(formatCurrencyInput(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as TransactionCategory)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading || !category}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Salvar transação
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
