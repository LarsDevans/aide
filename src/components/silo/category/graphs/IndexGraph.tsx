import React, { useContext, useEffect, useState } from "react"
import { SiloContext } from "@/contexts/SiloProvider"
import { Category } from "@/types/category"
import { listenForBySiloUid$ as listenForCategories$ } from "@/lib/silo/category"
import { getCategoryBalanceInCents } from "@/lib/silo/transaction"
import { Bar } from "react-chartjs-2"
import { getDatasetFromCategories } from "@/lib/helpers/graph"
import { forkJoin } from "rxjs"

export default function CategoryIndexGraph({
  transactionVersion,
}: {
  transactionVersion: number
}) {
  const siloCtx = useContext(SiloContext)
  const [categories, setCategories] = useState<Category[] | null>(null)
  const [expenses, setExpenses] = useState<number[]>([])

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Categorie",
          font: {
            weight: "bold" as const,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Bedrag in EUR",
          font: {
            weight: "bold" as const,
          },
        },
      },
    },
  }

  useEffect(() => {
    if (!siloCtx.siloUid) return

    const subscription = listenForCategories$(siloCtx.siloUid).subscribe(
      setCategories,
    )

    return () => subscription.unsubscribe()
  }, [siloCtx.siloUid])

  useEffect(() => {
    if (!siloCtx.siloUid || !categories) return

    const balanceObservables = categories.map((c) =>
      getCategoryBalanceInCents(siloCtx.siloUid as string, c.uid),
    )

    const subscription = forkJoin(balanceObservables).subscribe({
      next: (balances) => setExpenses(balances),
      error: (err) => console.error("Error bij laden balans:", err),
    })

    return () => subscription.unsubscribe()
  }, [siloCtx.siloUid, categories, transactionVersion])

  if (!categories) return

  return (
    <Bar
      data={getDatasetFromCategories(categories, expenses)}
      options={options}
    />
  )
}
