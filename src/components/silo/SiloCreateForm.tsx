"use client"

import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { useAuth } from "@/hooks/useAuth"
import { create } from "@/lib/silo"
import { createSchema } from "@/lib/validation/silo"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChangeEvent, FormEvent, useState } from "react"

export default function SiloCreateForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { currentUser } = useAuth()
  const router = useRouter()

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsSubmitting(true)

    if (validateSchema()) {
      await createSilo()
    }

    setIsSubmitting(false)
  }

  const validateSchema = (): boolean => {
    const result = createSchema.safeParse(formData)
    if (result.error) {
      setError(result.error.errors[0].message)
      return false
    }
    return true
  }

  const createSilo = async () => {
    try {
      const result = await create({
          name: formData.name,
          description: formData.description 
      }, currentUser?.uid ?? "")
      if (result === null) {
        setError("Firebase foutmelding (zie console)")
        return
      }
      setSuccess("Silo aangemaakt. Even geduld...")
      router.push('/silo')
    } catch (error: any) { // eslint-disable-line
      setError(error.message || "Er is een onbeschrijfelijke fout opgetreden")
    }
  }

  return (
    <div className="text-center w-96 space-y-2">

      <h1 className="text-center font-bold text-xl">Maak een nieuwe silo aan</h1>

      <form className="flex flex-col space-y-2" onSubmit={handleSubmit}>
        <Input
          name="name"
          placeholder="Naam"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
        />
        <Input
          name="description"
          placeholder="Omschrijving"
          type="text"
          value={formData.description}
          onChange={handleInputChange}
        />

        <div className="flex space-x-2 justify-between items-center">
          <Link className="underline" href="/silo">Annuleren</Link>
          <Button disabled={isSubmitting} label="Silo aanmaken" type="submit" />
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </form>

    </div>
  )
}
