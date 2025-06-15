export type Transaction = {
  uid: string
  type: "income" | "expense"
  amountInCents: number
  createdAt: Date
  categoryUid?: string
}

export type TransactionFormData = {
  type: "income" | "expense"
  amountInEuros: number
  categoryUid?: string
}
