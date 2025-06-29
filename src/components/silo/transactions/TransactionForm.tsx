// TODO: Duplicate code with SiloForm
"use client"

import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Select from "@/components/ui/Select"
import { listenForBySiloUid$ } from "@/lib/silo/category"
import { Category } from "@/types/category"
import { TransactionFormData } from "@/types/transaction"
import clsx from "clsx"
import React from "react"
import { ChangeEvent, FormEvent, ReactNode, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { z } from "zod"

export default function TransactionForm({
  buttonActions,
  initialFormData,
  linkActions,
  submitText,
  title,
  validation,
  submitAction,
}: {
  buttonActions?: ReactNode
  initialFormData?: TransactionFormData
  linkActions?: ReactNode
  submitText: string
  title: string
  validation: z.ZodTypeAny
  submitAction: (transactionFormData: TransactionFormData) => Promise<void>
}) {
  const [transactionFormData, setTransactionFormData] =
    useState<TransactionFormData>(
      initialFormData ?? {
        type: "income",
        amountInEuros: 0,
        categoryUid: undefined,
      },
    )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const params = useParams()
  const siloUid = params.uid as string
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const subscription = listenForBySiloUid$(siloUid).subscribe(
      (categories: Category[]) => {
        setCategories(categories)
      },
    )
    return () => subscription.unsubscribe()
  }, [siloUid])

  // Note: could behave unexpectedly, but it should be safe.
  const handleInputUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTransactionFormData((prev) => ({ ...prev, [name]: Number(value) }))
  }

  const handleSelectUpdate = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setTransactionFormData((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : value,
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
      await submitAction(transactionFormData)
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
    const result = validation.safeParse(transactionFormData)
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
        <Select
          name="type"
          value={transactionFormData.type}
          onChange={handleSelectUpdate}
          options={[
            { value: "income", label: "Inkomen" },
            { value: "expense", label: "Uitgave" },
          ]}
        />

        <Input
          name="amountInEuros"
          placeholder="Prijs in euros"
          type="number"
          step="0.01"
          value={
            transactionFormData.amountInEuros === 0
              ? ""
              : transactionFormData.amountInEuros
          }
          onChange={handleInputUpdate}
        />

        <Select
          name="categoryUid"
          value={transactionFormData.categoryUid}
          onChange={handleSelectUpdate}
          options={categories.map((category) => ({
            value: category.uid,
            label: category.name,
          }))}
          placeholder="Selecteer een categorie (optioneel)"
          allowClear
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
