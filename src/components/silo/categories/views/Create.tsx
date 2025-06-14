"use client"

import { create } from "@/lib/silo/category"
import Link from "next/link"
import { createSchema } from "@/lib/validation/category"
import { useRouter } from "next/navigation"
import { CategoryFormData } from "@/types/category"
import { euroToCents } from "@/lib/helpers/currency"
import CategoryForm from "@/components/silo/categories/CategoryForm"

export default function CategoryViewCreate({ siloUid }: { siloUid: string }) {
  const router = useRouter()

  const createCategory = async (categoryFormData: CategoryFormData) => {
    const budgetedAmountInCents = euroToCents(
      categoryFormData.budgetedAmountInEuros,
    )

    const result = await create(
      siloUid,
      categoryFormData.name,
      budgetedAmountInCents,
      categoryFormData.endDate,
    )

    if (result === null) {
      throw Error("Firebase foutmelding (zie console)")
    }

    router.push(`/silo/${siloUid}/transactions`)
  }

  const formLinkActions = (
    <Link
      className="underline"
      href={`/silo/${siloUid}/transactions`}
    >
      Annuleren
    </Link>
  )

  return (
    <CategoryForm
      linkActions={formLinkActions}
      submitText="Categorie toevoegen"
      title="Categorie toevoegen"
      validation={createSchema}
      submitAction={createCategory}
    />
  )
}
