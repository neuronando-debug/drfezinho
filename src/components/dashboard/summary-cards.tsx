import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardsProps {
  income: number;
  expenses: number;
  balance: number;
  isEmpty: boolean;
}

export function SummaryCards({ income, expenses, balance, isEmpty }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">Receitas</CardTitle>
          <TrendingUp className={cn("h-4 w-4", isEmpty ? "text-muted-foreground" : "text-green-500")} />
        </CardHeader>
        <CardContent>
          <p className={cn("text-2xl font-bold", isEmpty ? "text-muted-foreground" : "text-green-500")}>
            {formatCurrency(income)}
          </p>
          {isEmpty && (
            <p className="text-xs text-muted-foreground mt-1">Nenhuma receita registrada</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">Despesas</CardTitle>
          <TrendingDown className={cn("h-4 w-4", isEmpty ? "text-muted-foreground" : "text-red-500")} />
        </CardHeader>
        <CardContent>
          <p className={cn("text-2xl font-bold", isEmpty ? "text-muted-foreground" : "text-red-500")}>
            {formatCurrency(expenses)}
          </p>
          {isEmpty && (
            <p className="text-xs text-muted-foreground mt-1">Nenhuma despesa registrada</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">Saldo</CardTitle>
          <Wallet className={cn("h-4 w-4", isEmpty ? "text-muted-foreground" : balance >= 0 ? "text-blue-400" : "text-red-500")} />
        </CardHeader>
        <CardContent>
          <p className={cn(
            "text-2xl font-bold",
            isEmpty ? "text-muted-foreground" : balance >= 0 ? "text-blue-400" : "text-red-500"
          )}>
            {formatCurrency(balance)}
          </p>
          {isEmpty && (
            <p className="text-xs text-muted-foreground mt-1">Sem movimentações</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
