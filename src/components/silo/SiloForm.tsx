"use client"

import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { SiloFormData } from "@/types/silo"
import clsx from "clsx"
import { ChangeEvent, FormEvent, ReactNode, useState } from "react"
import { z } from "zod"

export default function SiloForm({
  buttonActions,
  initialFormData,
  linkActions,
  submitText,
  title,
  validation,
  submitAction,
}: {
  buttonActions?: ReactNode
  initialFormData?: SiloFormData
  linkActions?: ReactNode
  submitText: string
  title: string
  validation: z.ZodTypeAny
  submitAction: (siloFormData: SiloFormData) => Promise<void>
}) {
  const [siloFormData, setSiloFormData] = useState<SiloFormData>(
    initialFormData ?? {
      name: "",
      description: "",
    },
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Note: could behave unexpectedly, but it should be safe.
  const handleInputUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSiloFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    const { valid, error } = isFormValid()
    if (!valid) {
      setError(error || "Er is een onbeschrijfelijke fout opgetreden")
      setIsSubmitting(false)
      return
    }

    try {
      await submitAction(siloFormData)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Er is een onbeschrijfelijke fout opgetreden")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = (): { valid: boolean; error?: string } => {
    const result = validation.safeParse(siloFormData)
    if (!result.success) {
      return { valid: false, error: result.error.errors[0].message }
    }
    return { valid: true }
  }

  return (
    <div className="w-96 space-y-2 text-center">
      <h1 className="text-center text-xl font-bold">{title}</h1>

      <form
        className="flex flex-col space-y-2"
        onSubmit={handleFormSubmit}
      >
        <Input
          name="name"
          placeholder="Naam"
          type="text"
          value={siloFormData.name}
          onChange={handleInputUpdate}
        />
        <Input
          name="description"
          placeholder="Omschrijving"
          type="text"
          value={siloFormData.description}
          onChange={handleInputUpdate}
        />

        <div
          className={clsx("flex items-center space-x-2", {
            "justify-end": linkActions === null,
            "justify-between": linkActions !== null,
          })}
        >
          {linkActions}
          <div className="flex items-center justify-between space-x-2 pt-2">
            {buttonActions}
            <Button
              disabled={isSubmitting}
              label={submitText}
            />
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </form>
    </div>
  )
}
