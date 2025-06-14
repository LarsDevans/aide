export type Category = {
  uid: string
  name: string
  budgetedAmountInCents: number
  endDate?: Date | null
}

export type CategoryFormData = {
  name: string
  budgetedAmountInEuros: number
  endDate?: Date | null
}
