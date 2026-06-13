import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface EmptyStateProps {
  type: "dashboard" | "transactions" | "period";
  period?: string;
}

export function EmptyState({ type, period }: EmptyStateProps) {
  if (type === "dashboard") {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-5">
        <div className="text-7xl">📊</div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">
            Tudo começa com o primeiro lançamento
          </h3>
          <p className="text-muted-foreground max-w-md">
            Registre uma receita ou despesa para ver seu saldo, gráficos e resumo mensal aparecerem aqui.
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/transactions/new">
            <PlusCircle className="h-5 w-5" />
            Adicionar primeira transação
          </Link>
        </Button>
      </div>
    );
  }

  if (type === "transactions") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-5">
        <div className="text-6xl">💳</div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">Nenhuma transação por aqui</h3>
          <p className="text-muted-foreground max-w-sm">
            Adicione receitas e despesas para acompanhar para onde vai o seu dinheiro.
          </p>
        </div>
        <Button asChild>
          <Link href="/transactions/new">
            <PlusCircle className="h-4 w-4" />
            Registrar transação
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4">
      <div className="text-5xl">📅</div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-foreground">
          Sem movimentações em {period}
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Tente selecionar outro período ou adicione uma transação para este mês.
        </p>
      </div>
      <Button asChild variant="outline" size="sm">
        <Link href="/transactions/new">
          <PlusCircle className="h-4 w-4" />
          Adicionar transação
        </Link>
      </Button>
    </div>
  );
}
