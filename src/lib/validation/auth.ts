import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .email({ message: "Ongeldig e-mailadres" }),
  password: z
    .string()
    .min(6, { message: "Het wachtwoord is te kort (min. 6)" }),
  passwordConfirm: z
    .string(),
})
.refine((data) => data.password === data.passwordConfirm, {
  message: "Wachtwoorden zijn niet hetzelfde",
  path: ["passwordConfirm"],
});

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Ongeldig e-mailadres" }),
  password: z
    .string(),
});
