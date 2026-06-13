"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/dashboard/empty-state";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PlusCircle, Search, Trash2, Loader2 } from "lucide-react";
import type { Transaction } from "@/types/database";
import { useToast } from "@/hooks/use-toast";

const CATEGORY_LABELS: Record<string, string> = {
  salary: "Salário", freelance: "Freelance", investment: "Investimentos",
  food: "Alimentação", transport: "Transporte", health: "Saúde",
  education: "Educação", entertainment: "Lazer", housing: "Moradia",
  utilities: "Contas", clothing: "Vestuário", other: "Outros",
};

interface TransactionsClientProps {
  transactions: Transaction[];
}

export default function TransactionsClient({ transactions: initial }: TransactionsClientProps) {
  const [transactions, setTransactions] = useState(initial);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const filtered = useMemo(() =>
    transactions.filter((t) => {
      const matchType = filterType === "all" || t.type === filterType;
      const matchSearch = t.description.toLowerCase().includes(search.toLowerCase()) ||
        (CATEGORY_LABELS[t.category] ?? "").toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    }),
    [transactions, filterType, search]
  );

  async function handleDelete(id: string) {
    setDeletingId(id);
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Erro ao deletar", description: error.message });
    } else {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      toast({ title: "Transação removida" });
      router.refresh();
    }
    setDeletingId(null);
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transações</h1>
          <p className="text-muted-foreground text-sm">Histórico de receitas e despesas</p>
        </div>
        <Button asChild>
          <Link href="/transactions/new">
            <PlusCircle className="h-4 w-4" />
            Nova transação
          </Link>
        </Button>
      </div>

      {transactions.length === 0 ? (
        <EmptyState type="transactions" />
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar transações..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "income", "expense"] as const).map((type) => (
                <Button
                  key={type}
                  variant={filterType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType(type)}
                >
                  {type === "all" ? "Todas" : type === "income" ? "Receitas" : "Despesas"}
                </Button>
              ))}
            </div>
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <p>Nenhuma transação encontrada com os filtros atuais.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-10 rounded-full flex-shrink-0 ${t.type === "income" ? "bg-green-500" : "bg-red-500"}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{t.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant={t.type === "income" ? "income" : "expense"} className="text-xs">
                          {t.type === "income" ? "Receita" : "Despesa"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{CATEGORY_LABELS[t.category]}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{formatDate(t.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-sm font-bold ${t.type === "income" ? "text-green-500" : "text-red-500"}`}>
                      {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(t.id)}
                      disabled={deletingId === t.id}
                    >
                      {deletingId === t.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
