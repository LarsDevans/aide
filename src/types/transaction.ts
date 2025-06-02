export type Transaction = {
  uid: string
  type: "income" | "expense"
  amountInCents: number
  createdAt: Date
}

export type TransactionFormData = {
  type: "income" | "expense"
  amountInCents: number
}
