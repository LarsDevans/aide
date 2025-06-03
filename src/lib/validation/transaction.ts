import { z } from "zod"

export const createSchema = z.object({
  type: z.enum(["income", "expense"], {
    errorMap: () => ({ message: "Kies een type" }),
  }),
  amountInEuros: z.number().positive({
    message: "Voer een positief bedrag in",
  }),
})
export const updateSchema = z.object({
  type: z.enum(["income", "expense"], {
    errorMap: () => ({ message: "Kies een type" }),
  }),
  amountInEuros: z.number().positive({
    message: "Voer een positief bedrag in",
  }),
})
