import { z } from "zod"

export const createSchema = z.object({
    type: z.enum(["income", "expense"], {
        errorMap: () => ({ message: "Kies een type" }),
    }),
    amountInCents: z.string(),
})
export const updateSchema = z.object({
    type: z.enum(["income", "expense"], {
        errorMap: () => ({ message: "Kies een type" }),
    }),
    amountInCents: z.string(),
})
