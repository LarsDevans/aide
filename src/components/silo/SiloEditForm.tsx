"use client"

import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { archive, getByUid, update } from "@/lib/silo"
import { updateSchema } from "@/lib/validation/silo"
import { Silo } from "@/types/silo"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"

export default function SiloEditForm({ uid }: { uid: string }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [silo, setSilo] = useState<Silo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchSilo = async () => {
      const silo = await getByUid(uid)
      setFormData({
        name: silo?.name ?? "",
        description: silo?.description ?? "",
      })
      setSilo(silo)
    }
    fetchSilo()
  }, [uid])

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
      await updateSilo()
    }

    setIsSubmitting(false)
  }

  const validateSchema = (): boolean => {
    const result = updateSchema.safeParse(formData)
    if (result.error) {
      setError(result.error.errors[0].message)
      return false
    }
    return true
  }

  const updateSilo = async () => {
    try {
      const result = await update(uid, {
        name: formData.name,
        description: formData.description,
      })
      if (result === null) {
        setError("Firebase foutmelding (zie console)")
        return
      }
      setSuccess("Silo aangepast. Even geduld...")
      router.push("/silo")
    } catch (error: any) {
      // eslint-disable-line
      setError(error.message || "Er is een onbeschrijfelijke fout opgetreden")
    }
  }

  const archiveSilo = async () => {
    await archive(silo?.uid ?? "")
    router.push("/silo")
  }

  return (
    <div className="w-96 space-y-2 text-center">
      <h1 className="text-center text-xl font-bold">
        Pas de silo gegevens aan
      </h1>

      <form
        className="flex flex-col space-y-2"
        onSubmit={handleSubmit}
      >
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
        <div className="flex items-center justify-between space-x-2 pt-2">
          <Link
            className="underline"
            href="/silo"
          >
            Annuleren
          </Link>
          <div className="space-x-2">
            <Button
              label="Archiveren"
              onClick={archiveSilo}
            />
            <Button
              disabled={isSubmitting}
              label="Silo aanpassen"
              type="submit"
            />
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </form>
    </div>
  )
}
