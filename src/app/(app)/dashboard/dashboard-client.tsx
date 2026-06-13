"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { ExpenseChart } from "@/components/dashboard/expense-chart";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { EmptyState } from "@/components/dashboard/empty-state";
import { formatCurrency, getMonthName } from "@/lib/utils";
import { ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import type { Transaction } from "@/types/database";

const CATEGORY_LABELS: Record<string, string> = {
  salary: "Salário", freelance: "Freelance", investment: "Investimentos",
  food: "Alimentação", transport: "Transporte", health: "Saúde",
  education: "Educação", entertainment: "Lazer", housing: "Moradia",
  utilities: "Contas", clothing: "Vestuário", other: "Outros",
};

interface DashboardClientProps {
  userName: string;
  transactions: Transaction[];
}

export default function DashboardClient({ userName, transactions }: DashboardClientProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const hasAnyTransaction = transactions.length > 0;

  const filtered = useMemo(() =>
    transactions.filter((t) => {
      const [ty, tm] = t.date.split("-").map(Number);
      return ty === year && tm === month;
    }),
    [transactions, year, month]
  );

  const income = useMemo(() => filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0), [filtered]);
  const expenses = useMemo(() => filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0), [filtered]);
  const balance = income - expenses;

  const hasPeriodData = filtered.length > 0;

  // Build last 6 months chart data
  const chartData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(year, month - 1 - i, 1);
      const m = d.getMonth() + 1;
      const y = d.getFullYear();
      const monthTxs = transactions.filter((t) => {
        const [ty, tm] = t.date.split("-").map(Number);
        return ty === y && tm === m;
      });
      months.push({
        name: getMonthName(m).substring(0, 3),
        receitas: monthTxs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
        despesas: monthTxs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
      });
    }
    return months;
  }, [transactions, year, month]);

  // Category breakdown for current period
  const categoryData = useMemo(() => {
    const map = new Map<string, number>();
    filtered.filter((t) => t.type === "expense").forEach((t) => {
      map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
    });
    return Array.from(map.entries())
      .map(([key, value]) => ({ name: CATEGORY_LABELS[key] ?? key, value }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  const firstName = userName.split(" ")[0];

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Olá, {firstName}!</h1>
          <p className="text-muted-foreground text-sm">Aqui está seu resumo financeiro</p>
        </div>
        <Button asChild>
          <Link href="/transactions/new">
            <PlusCircle className="h-4 w-4" />
            Nova transação
          </Link>
        </Button>
      </div>

      {!hasAnyTransaction ? (
        <EmptyState type="dashboard" />
      ) : (
        <>
          {/* Period selector */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-28 text-center">
              {getMonthName(month)} de {year}
            </span>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {!hasPeriodData ? (
            <EmptyState type="period" period={`${getMonthName(month)} de ${year}`} />
          ) : (
            <>
              <SummaryCards income={income} expenses={expenses} balance={balance} isEmpty={false} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ExpenseChart data={chartData} isEmpty={!hasAnyTransaction} />
                <CategoryChart data={categoryData} isEmpty={categoryData.length === 0} />
              </div>

              {/* Recent transactions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-foreground">Transações recentes</h2>
                  <Link href="/transactions" className="text-sm text-primary hover:underline">
                    Ver todas
                  </Link>
                </div>
                <div className="space-y-2">
                  {filtered.slice(0, 5).map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-foreground">{t.description}</p>
                        <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[t.category]}</p>
                      </div>
                      <span className={`text-sm font-semibold ${t.type === "income" ? "text-green-500" : "text-red-500"}`}>
                        {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
