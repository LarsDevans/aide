"use client"

import TransactionForm from "@/components/silo/transactions/TransactionForm"
import LoadingState from "@/components/ui/LoadingState"
import { convertCentsToEuros, euroToCents } from "@/lib/helpers/currency"
import { getByUid, update } from "@/lib/silo/transaction"
import { createSchema } from "@/lib/validation/transaction"
import { Transaction, TransactionFormData } from "@/types/transaction"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function TransactionViewEdit({
  siloUid,
  transactionUid,
}: {
  siloUid: string
  transactionUid: string
}) {
  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchTransaction = async () => {
      const transaction = await getByUid(siloUid, transactionUid)
      setTransaction(transaction)
    }
    fetchTransaction()
  }, [siloUid, transactionUid])

  // To prevent unexpected behavior, we make sure the transaction is loaded.
  if (transaction === null) {
    return <LoadingState />
  }

  const updateTransaction = async (
    transactionFormData: TransactionFormData,
  ) => {
    const result = await update(siloUid, transactionUid, {
      ...transaction,
      type: transactionFormData.type,
      amountInCents: euroToCents(transactionFormData.amountInEuros),
      categoryUid: transactionFormData.categoryUid,
    })
    if (result === null) {
      throw Error("Firebase foutmelding (zie console)")
    }
    router.push(`/silo/${siloUid}`)
  }

  const formLinkActions = (
    <Link
      className="underline"
      href={`/silo/${siloUid}`}
    >
      Annuleren
    </Link>
  )

  return (
    <TransactionForm
      linkActions={formLinkActions}
      initialFormData={{
        type: transaction.type,
        amountInEuros: convertCentsToEuros(transaction.amountInCents),
        categoryUid: transaction.categoryUid ?? undefined,
      }}
      submitText="Transactie aanpassen"
      title="Transactie aanpassen"
      validation={createSchema}
      submitAction={updateTransaction}
    />
  )
}
