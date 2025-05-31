export type Transaction = {
    uid: string
    type: "income" | "expense"
    amountInCents: number
    date: Date
}

export type TransactionFormData = {
    type: "income" | "expense"
    amountInCents: number
}
