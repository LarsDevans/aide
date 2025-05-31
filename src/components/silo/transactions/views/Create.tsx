"use client"

import { create } from "@/lib/silo/transaction"
import { TransactionFormData } from "@/types/transaction"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import TransactionForm from "@/components/silo/transactions/TransactionForm"
import { createSchema } from "@/lib/validation/transaction"

export default function TransactionViewCreate() {
  const router = useRouter()
  const params = useParams()
  const siloUid = params?.uid as string

  const createTransaction = async (transactionFormData: TransactionFormData) => {
    const result = await create(
        siloUid,
        transactionFormData.type,
        transactionFormData.amountInCents
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
