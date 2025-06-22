import {
  getDatasetFromCategories,
  getDatasetFromTransactions,
} from "@/lib/helpers/graph"
import { Category } from "@/types/category"
import { Transaction } from "@/types/transaction"

describe("getDatasetFromCategories", () => {
  it("returns correct labels and datasets based on categories and expenses", () => {
    const categories: Category[] = [
      {
        uid: "cat-123",
        name: "OV",
        budgetedAmountInCents: 50000,
        endDate: null,
      },
      {
        uid: "cat-456",
        name: "Uitjes",
        budgetedAmountInCents: 20000,
        endDate: null,
      },
    ]

    const expenses = [3000, 10000]

    const result = getDatasetFromCategories(categories, expenses)

    expect(result.labels).toEqual(["OV", "Uitjes"])
    expect(result.datasets).toHaveLength(2)
    expect(result.datasets[0]).toEqual({
      label: "Uitgaven (EUR)",
      data: [30, 100],
      backgroundColor: "rgba(59, 130, 246)",
    })
    expect(result.datasets[1]).toEqual({
      label: "Budget (EUR)",
      data: [500, 200],
      backgroundColor: "rgba(16, 185, 129)",
    })
  })
})

describe("getDatasetFromTransactions", () => {
  it("returns correct daily income and expenses dataset for the month", () => {
    const month = 5
    const dayInMonth = 22

    const transactions: Transaction[] = [
      {
        uid: "trans-123",
        type: "expense",
        amountInCents: 5000,
        createdAt: new Date(new Date().getFullYear(), month, dayInMonth),
      },
      {
        uid: "trans-456",
        type: "income",
        amountInCents: 10000,
        createdAt: new Date(new Date().getFullYear(), month, dayInMonth),
      },
    ]

    const result = getDatasetFromTransactions(month, transactions)

    const label = new Date(
      new Date().getFullYear(),
      month,
      dayInMonth,
    ).toLocaleDateString("nl-NL", { month: "2-digit", day: "2-digit" })

    const dayIndex = result.labels.indexOf(label)

    expect(result.datasets[0].label).toBe("Uitgaven (EUR)")
    expect(result.datasets[1].label).toBe("Inkomen (EUR)")
    expect(result.datasets[0].data[dayIndex]).toBe(50)
    expect(result.datasets[1].data[dayIndex]).toBe(100)
  })
})
