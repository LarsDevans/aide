import { z } from "zod";

export const createSchema = z.object({
  name: z
    .string()
    .min(3, { message: "De naam is te kort (min. 3)"}),
  description: z
    .string(),
});
export const updateSchema = z.object({
  name: z
    .string()
    .min(3, { message: "De naam is te kort (min. 3)"}),
  description: z
    .string(),
});
