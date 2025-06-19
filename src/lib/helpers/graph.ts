import { Category } from "@/types/category"
import { Transaction } from "@/types/transaction"
import { getDatesInMonth, getMonthString, toDate } from "./date"

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

export function getDatasetFromTransactions(
  month: number,
  transactions: Transaction[],
) {
  const dates = getDatesInMonth(new Date().getFullYear(), month);
  const labels = dates.map((d) =>
    d.toLocaleDateString("nl-NL", { month: "2-digit", day: "2-digit" }),
  )

  function getAccumulativeExpenses(date: Date, type: string) {
    return transactions
      .filter((t) => t.type === type)
      .filter((t) => {
        const tDate = toDate(t.createdAt)
        console.log(tDate)
        return (
          tDate.getFullYear() === date.getFullYear() &&
          tDate.getMonth() === date.getMonth() &&
          tDate.getDate() === date.getDate()
        )
      })
      .reduce((acc, n) => acc + n.amountInCents, 0) / 100;
  }

  const expensesDataset = dates.map((d => getAccumulativeExpenses(d, "expense")))
  const incomeDataset = dates.map((d => getAccumulativeExpenses(d, "income")))

  return {
    labels,
    datasets: [
      {
        label: "Uitgaven (EUR)",
        data: expensesDataset,
        fill: true,
        backgroundColor: "rgba(59, 130, 246)",
        borderColor: "rgba(59, 130, 246)",
      },
      {
        label: "Inkomen (EUR)",
        data: incomeDataset,
        fill: true,
        backgroundColor: "rgba(16, 185, 129)",
        borderColor: "rgba(16, 185, 129)",
      },
    ],
  }
}
