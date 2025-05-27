export type Transaction = {
    uid: string
    type: "income" | "expense"
    amountInCents: number
    date: string
}

export type TransactionFormData = {
    type: "income" | "expense"
    amountInCents: number
}
