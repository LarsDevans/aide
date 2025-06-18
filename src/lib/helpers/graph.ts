import { Category } from "@/types/category"
import { Transaction } from "@/types/transaction"

export function getDatasetFromCategories(
  categories: Category[],
  expenses: number[],
) {
  return {
    labels: categories.map((c) => c.name),
    datasets: [
      {
        label: "Uitgaven (EUR)",
        data: expenses.map((e) => e / 100),
        backgroundColor: "rgba(59, 130, 246)",
      },
      {
        label: "Budget (EUR)",
        data: categories.map((c) =>
          c.budgetedAmountInCents ? c.budgetedAmountInCents / 100 : 0,
        ),
        backgroundColor: "rgba(16, 185, 129)",
      },
    ],
  }
}
