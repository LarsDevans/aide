import { z } from "zod"

export const createSchema = z.object({
  name: z.string().min(1, {
    message: "Voer een naam in",
  }),
  budgetedAmountInEuros: z.number().positive({
    message: "Voer een positief bedrag in",
  }),
})
