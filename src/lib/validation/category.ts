import { z } from "zod"

export const createSchema = z.object({
  name: z.string().min(1, {
    message: "Voer een naam in",
  }),
  budgetedAmountInEuros: z.number().positive({
    message: "Voer een positief bedrag in",
  }),
  endDate: z
    .date()
    .optional()
    .nullable()
    .refine(
      (date) => {
        if (!date) return true
        const today = new Date()
        return date > today
      },
      {
        message: "De einddatum moet in de toekomst liggen",
      },
    ),
})
