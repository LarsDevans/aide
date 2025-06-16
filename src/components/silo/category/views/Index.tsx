"use client"

import { centsToCurrency } from "@/lib/helpers/currency"
import { formatDate } from "@/lib/helpers/date"
import { getCategoryBalanceInCents } from "@/lib/silo/transaction"
import { Category } from "@/types/category"
import { useEffect, useState } from "react"
import { listenForBySiloUid as listenForCategories } from "@/lib/silo/category"
import { listenForBySiloUid as listenForTransactions } from "@/lib/silo/transaction"
import Link from "next/link"

export default function CategoryViewIndex({ siloUid }: { siloUid: string }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [transactionsVersion, setTransactionsVersion] = useState(0)

  useEffect(() => {
    const unsubscribe = listenForCategories(siloUid, setCategories)
    return unsubscribe
  }, [siloUid])

  useEffect(() => {
    const unsubscribe = listenForTransactions(siloUid, () =>
      setTransactionsVersion((v) => v + 1),
    )
    return unsubscribe
  }, [siloUid])

  return (
    <div className="mx-auto p-6">
      <Link
        href={`/silo/${siloUid}/category/create`}
        className="underline"
        aria-label="Voeg categorie toe"
      >
        Voeg categorie toe
      </Link>
      <h2 className="mt-4 text-lg font-bold">Categorieën</h2>
      <div className="mt-2">
        {categories.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.uid}
                category={category}
                siloUid={siloUid}
                transactionsVersion={transactionsVersion}
              />
            ))}
          </div>
        ) : (
          <p>Geen categorieën gevonden.</p>
        )}
      </div>
    </div>
  )
}

function CategoryCard({
  category,
  siloUid,
  transactionsVersion,
}: {
  category: Category
  siloUid: string
  transactionsVersion: number
}) {
  const [totalExpense, setTotalExpense] = useState<number | null>(null)

  useEffect(() => {
    if (!category.uid) return
    getCategoryBalanceInCents(siloUid, category.uid)
      .then(setTotalExpense)
      .catch((error) =>
        console.error("Fout bij het ophalen van totale uitgaven:", error),
      )
  }, [category.uid, siloUid, transactionsVersion])

  const budgeted = category.budgetedAmountInCents
  const spent = totalExpense ?? 0
  const remaining = budgeted - spent
  const percentageLeft = budgeted > 0 ? remaining / budgeted : 0

  let statusColor = "bg-green-100 text-green-800"
  if (remaining < 0) {
    statusColor = "bg-red-100 text-red-800"
  } else if (percentageLeft < 0.2) {
    statusColor = "bg-yellow-100 text-yellow-800"
  }

  return (
    <div className="space-y-2 rounded-lg border p-4">
      <h3 className="text-md font-semibold">{category.name}</h3>
      <p className="text-sm">
        EUR {centsToCurrency(spent)} / EUR {centsToCurrency(budgeted)}
      </p>
      {category.endDate && (
        <p className="text-sm">Einddatum: {formatDate(category.endDate)}</p>
      )}
      <p className={`rounded px-2 py-1 text-sm font-semibold ${statusColor}`}>
        {remaining < 0
          ? `Budget overschreden met EUR ${centsToCurrency(Math.abs(remaining))}`
          : `Nog EUR ${centsToCurrency(remaining)} beschikbaar`}
      </p>
    </div>
  )
}
