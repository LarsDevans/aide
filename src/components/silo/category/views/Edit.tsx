"use client"

import CategoryForm from "@/components/silo/category/CategoryForm"
import Button from "@/components/ui/Button"
import LoadingState from "@/components/ui/LoadingState"
import { convertCentsToEuros, euroToCents } from "@/lib/helpers/currency"
import { deleteByUid, getByUid, update } from "@/lib/silo/category"
import { createSchema } from "@/lib/validation/category"
import { Category, CategoryFormData } from "@/types/category"
import { Trash } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function CategoryViewEdit({
  siloUid,
  categoryUid,
}: {
  siloUid: string
  categoryUid: string
}) {
  const [category, setCategory] = useState<Category | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchCategory = async () => {
      const category = await getByUid(siloUid, categoryUid)
      setCategory(category)
    }
    fetchCategory()
  }, [siloUid, categoryUid])

  // To prevent unexpected behavior, we make sure the category is loaded.
  if (category === null) {
    return <LoadingState />
  }

  const updateCategory = async (categoryFormData: CategoryFormData) => {
    const result = await update(siloUid, categoryUid, {
      ...category,
      name: categoryFormData.name,
      budgetedAmountInCents: euroToCents(
        categoryFormData.budgetedAmountInEuros,
      ),
      endDate: categoryFormData.endDate
        ? new Date(categoryFormData.endDate)
        : null,
    })
    if (result === null) {
      throw Error("Firebase foutmelding (zie console)")
    }
    router.push(`/silo/${siloUid}`)
  }

  const handleDelete = async () => {
    if (confirm("Weet je zeker dat je deze categorie wilt verwijderen?")) {
      try {
        await deleteByUid(siloUid, categoryUid)
        router.push(`/silo/${siloUid}`)
      } catch (error) {
        console.error("Fout bij het verwijderen van transactie:", error)
      }
    }
  }

  const formLinkActions = (
    <Link
      className="underline"
      href={`/silo/${siloUid}`}
    >
      Annuleren
    </Link>
  )

  const formButtonActions = (
    <Button
      label={<Trash />}
      type="button"
      onClick={handleDelete}
    />
  )

  return (
    <CategoryForm
      buttonActions={formButtonActions}
      linkActions={formLinkActions}
      initialFormData={{
        name: category.name,
        budgetedAmountInEuros: convertCentsToEuros(
          category.budgetedAmountInCents,
        ),
        endDate: category.endDate ?? null,
      }}
      submitText="Transactie aanpassen"
      title="Transactie aanpassen"
      validation={createSchema}
      submitAction={updateCategory}
    />
  )
}
