"use client"

import { centsToCurrency } from "@/lib/helpers/currency"
import { formatDate } from "@/lib/helpers/date"
import {
  assignCategory,
  getCategoryBalanceInCents,
} from "@/lib/silo/transaction"
import { Category } from "@/types/category"
import { useEffect, useState } from "react"
import { listenForBySiloUid as listenForCategories } from "@/lib/silo/category"
import { listenForBySiloUid as listenForTransactions } from "@/lib/silo/transaction"
import Link from "next/link"
import EmptyState from "@/components/ui/EmptyState"
import CategoryCtaCreate from "../cta/Create"
import CategoryIndexGraph from "../graphs/IndexGraph"
import { useDrop } from "react-dnd"
import { Transaction } from "@/types/transaction"

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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.uid}
                  category={category}
                  siloUid={siloUid}
                  transactionsVersion={transactionsVersion}
                />
              ))}
            </div>

            <CategoryIndexGraph transactionVersion={transactionsVersion} />
          </div>
        ) : (
          <EmptyState
            cta={
              <CategoryCtaCreate href={`/silo/${siloUid}/category/create`} />
            }
          />
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

  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: "TRANSACTION",
    drop: async (item: { transaction: Transaction }) => {
      await assignCategory(siloUid, item.transaction.uid, category.uid)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

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

  const dropHighlight =
    isOver && canDrop
      ? "ring-2 ring-blue-400"
      : canDrop
        ? "ring-2 ring-blue-200"
        : ""

  return (
    <Link href={`/silo/${siloUid}/category/${category.uid}/edit`}>
      <div
        // @ts-expect-error ref is used by react-dnd
        ref={dropRef}
        className={`flex h-full flex-col justify-between space-y-2 rounded-lg border p-4 transition-shadow ${dropHighlight}`}
      >
        <div>
          <h3 className="text-md font-semibold">{category.name}</h3>
          <p className="text-sm">
            EUR {centsToCurrency(spent)} / EUR {centsToCurrency(budgeted)}
          </p>
          {category.endDate && (
            <p className="text-sm">Einddatum: {formatDate(category.endDate)}</p>
          )}
        </div>
        <p className={`rounded px-2 py-1 text-sm font-semibold ${statusColor}`}>
          {remaining < 0
            ? `Budget overschreden met EUR ${centsToCurrency(Math.abs(remaining))}`
            : `Nog EUR ${centsToCurrency(remaining)} beschikbaar`}
        </p>
      </div>
    </Link>
  )
}
