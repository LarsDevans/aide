"use client"

import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { signUp } from "@/lib/auth"
import { registerSchema } from "@/lib/validation/auth"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChangeEvent, FormEvent, useState } from "react"

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    if (validateSchema()) {
      await registerUser()
    }

    setIsLoading(false)
  }

  const validateSchema = (): boolean => {
    const result = registerSchema.safeParse(formData)
    if (result.error) {
      setError(result.error.errors[0].message)
      return false
    }
    return true
  }

  const registerUser = async () => {
    try {
      const result = await signUp(formData.email, formData.password)
      if (result === null) {
        setError("Firebase foutmelding (zie console)")
        return
      }
      setSuccess("Account aangemaakt. Even geduld...")
      router.push("/auth/login")
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Er is een onbeschrijfelijke fout opgetreden")
      }
    }
  }

  return (
    <div className="text-center">
      <form
        className="flex w-72 flex-col items-center space-y-2"
        onSubmit={handleSubmit}
      >
        <h1 className="text-xl font-bold">Registreer een Aide account</h1>

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
        <Button
          disabled={isLoading}
          label="Account registreren"
          type="submit"
          width="w-full"
        />

        <div className="flex space-x-1">
          <p>Al een account?</p>
          <Link
            className="underline"
            href="/auth/login"
          >
            Log in
          </Link>
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </form>
    </div>
  )
}
