// TODO: Duplicate code with SiloForm
"use client"

import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { formatDateForInput } from "@/lib/helpers/date"
import { CategoryFormData } from "@/types/category"
import clsx from "clsx"
import { ChangeEvent, FormEvent, ReactNode, useState } from "react"
import { z } from "zod"

export default function CategoryForm({
  buttonActions,
  initialFormData,
  linkActions,
  submitText,
  title,
  validation,
  submitAction,
}: {
  buttonActions?: ReactNode
  initialFormData?: CategoryFormData
  linkActions?: ReactNode
  submitText: string
  title: string
  validation: z.ZodTypeAny
  submitAction: (categoryFormData: CategoryFormData) => Promise<void>
}) {
  const [categoryFormData, setCategoryFormData] = useState<CategoryFormData>(
    initialFormData ?? {
      name: "",
      budgetedAmountInEuros: 0,
      endDate: null,
    },
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Note: could behave unexpectedly, but it should be safe.
  const handleStringInputUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCategoryFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberInputUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCategoryFormData((prev) => ({ ...prev, [name]: Number(value) }))
  }

  const handleDateInputUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCategoryFormData((prev) => ({
      ...prev,
      [name]: value ? new Date(value) : null,
    }))
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
      await submitAction(categoryFormData)
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
    const result = validation.safeParse(categoryFormData)
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
          value={categoryFormData.name}
          onChange={handleStringInputUpdate}
        />

        <Input
          name="budgetedAmountInEuros"
          placeholder="Budgetbedrag in Euro's"
          type="number"
          step="0.01"
          value={
            categoryFormData.budgetedAmountInEuros === 0
              ? ""
              : categoryFormData.budgetedAmountInEuros
          }
          onChange={handleNumberInputUpdate}
        />

        <label className="text-left">Einddatum (optioneel):</label>
        <Input
          name="endDate"
          placeholder="Einddatum (optioneel)"
          type="date"
          value={
            categoryFormData.endDate
              ? formatDateForInput(categoryFormData.endDate)
              : ""
          }
          onChange={handleDateInputUpdate}
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
