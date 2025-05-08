"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { signUp } from "@/lib/auth";
import { registerSchema } from "@/lib/validation/auth";
import { ChangeEvent, FormEvent, useState } from "react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!validateSchema()) return;

    await registerUser();
  };

  const validateSchema = (): boolean => {
    const result = registerSchema.safeParse(formData);
    if (result.error) {
      setError(result.error.errors[0].message);
      return false;
    }
    return true;
  };

  const registerUser = async () => {
    try {
      const result = await signUp(formData.email, formData.password);
      if (result === null) {
        setError("Firebase foutmelding (zie console)");
        return;
      }
      // TODO: Redirect to the login page
    } catch (error: any) { // eslint-disable-line
      setError(error.message || "Er is een onbeschrijfelijke fout opgetreden");
    }
  };

  return (
    <div className="text-center">

      <h1>Registreer een Aide account</h1>

      <form className="flex flex-col" onSubmit={handleSubmit}>
        <Input
          name="email"
          placeholder="E-mail"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <Input
          name="password"
          placeholder="Wachtwoord"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <Input
          name="passwordConfirm"
          placeholder="Herhaal wachtwoord"
          type="password"
          value={formData.passwordConfirm}
          onChange={handleInputChange}
        />
        <Button label="Account registreren" type="submit" />

        {error && <p className="text-red-500">{error}</p>}
      </form>

    </div>
  );
}
