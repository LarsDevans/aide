import { z } from "zod";

export const createSchema = z.object({
  name: z
    .string()
    .min(3, { message: "De naam moet minimaal 3 karakters lang zijn"}),
  description: z
    .string(),
});
export const updateSchema = z.object({
  name: z
    .string()
    .min(3, { message: "De naam moet minimaal 3 karakters lang zijn"}),
  description: z
    .string(),
});
