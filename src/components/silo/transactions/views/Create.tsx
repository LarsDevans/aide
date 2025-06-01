"use client"

import { create } from "@/lib/silo/transaction"
import { TransactionFormData } from "@/types/transaction"
import Link from "next/link"
import TransactionForm from "@/components/silo/transactions/TransactionForm"
import { createSchema } from "@/lib/validation/transaction"
import { useRouter } from "next/navigation"

export default function TransactionViewCreate({
  siloUid,
}: {
  siloUid: string
}) {
  const router = useRouter()
  const createTransaction = async (
    transactionFormData: TransactionFormData,
  ) => {
    const result = await create(
      siloUid,
      transactionFormData.type,
      transactionFormData.amountInCents,
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
    <TransactionForm
      linkActions={formLinkActions}
      submitText="Transactie aanmaken"
      title="Transactie aanmaken"
      validation={createSchema}
      submitAction={createTransaction}
    />
  )
}
