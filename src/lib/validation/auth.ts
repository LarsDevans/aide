import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .email({ message: "Ongeldig e-mailadres" }),
  password: z
    .string()
    .min(6, { message: "Het wachtwoord moet minimaal 6 karakters lang zijn" }),
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
