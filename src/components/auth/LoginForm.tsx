"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { signIn } from "@/lib/auth";
import { loginSchema } from "@/lib/validation/auth";
import { ChangeEvent, FormEvent, useState } from "react";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    if (validateSchema()) {
      await loginUser();
    }

    setIsLoading(false);
  };

  const validateSchema = (): boolean => {
    const result = loginSchema.safeParse(formData);
    if (result.error) {
      setError(result.error.errors[0].message);
      return false;
    }
    return true;
  };

  const loginUser = async () => {
    try {
      const result = await signIn(formData.email, formData.password);
      if (result === null) {
        setError("Firebase foutmelding (zie console)");
        return;
      }
      setSuccess("Succesvol ingelogd. Even geduld...");
      // TODO: Redirect to the home page
    } catch (error: any) { // eslint-disable-line
      setError(error.message || "Er is een onbeschrijfelijke fout opgetreden");
    }
  };

  return (
    <div className="text-center">

      <h1>Login met jouw Aide account</h1>

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
        <Button disabled={isLoading} label="Inloggen" type="submit" />

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </form>

    </div>
  );
}
