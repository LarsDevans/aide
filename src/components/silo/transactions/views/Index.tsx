"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Table, TableCell, TableHead, TableRow } from "@/components/ui/Table"
import Select from "@/components/ui/Select"
import { PencilLine, Trash2 } from "lucide-react"
import { Transaction } from "@/types/transaction"
import { Silo } from "@/types/silo"
import {
  deleteByUid,
  getCategoryExpenseTotalCents,
  listenForBySiloUid as listenForTransactionsBySiloUid,
} from "@/lib/silo/transaction"
import { listenForBySiloUid as listenForCategoriesBySiloUid } from "@/lib/silo/category"
import { getByUid } from "@/lib/silo/silo"
import Link from "next/link"
import IconButton from "@/components/ui/IconButton"
import { getMonthString, formatDate, sortByDateDesc } from "@/lib/helpers/date"
import { useParams } from "next/navigation"
import { centsToCurrency } from "@/lib/helpers/currency"
import router from "next/router"
import { Category } from "@/types/category"
import { getByUid as getCategoryByUid } from "@/lib/silo/category"

export default function TransactionViewIndex() {
  const params = useParams()
  const siloUid = params.uid as string
  const [transactions, setTransactions] = useState<Transaction[] | null>(null)
  const [silo, setSilo] = useState<Silo | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string>()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const unsubscribe = listenForTransactionsBySiloUid(
      siloUid,
      (transactions: Transaction[]) => {
        transactions.sort(sortByDateDesc)
        setTransactions(transactions)
      },
    )
    return () => unsubscribe()
  }, [siloUid])

  useEffect(() => {
    const fetchSilo = async () => {
      const silo = await getByUid(siloUid)
      if (silo) {
        setSilo(silo)
      } else {
        router.push("/silo")
      }
    }
    fetchSilo()
  }, [siloUid])

  useEffect(() => {
    const unsubscribe = listenForCategoriesBySiloUid(
      siloUid,
      (categories: Category[]) => {
        setCategories(categories)
      },
    )
    return () => unsubscribe()
  }, [siloUid])

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const firstTransaction = transactions[0]
      setSelectedMonth(getMonthString(firstTransaction.createdAt))
    }
  }, [transactions])

  const transactionsForSelectedMonth = useMemo(() => {
    return (
      transactions?.filter(
        (t) => getMonthString(t.createdAt) === selectedMonth,
      ) ?? []
    )
  }, [transactions, selectedMonth])

  const availableMonths = useMemo(() => {
    const months = [
      ...new Set((transactions ?? []).map((t) => getMonthString(t.createdAt))),
    ]

    const currentMonth = getMonthString(new Date().toISOString())

    if (months.length === 0) {
      return [currentMonth]
    }

    return months.sort((a, b) => b.localeCompare(a))
  }, [transactions])

  const { incomeTotal, expenseTotal, balance } = useMemo(() => {
    let income = 0,
      expense = 0
    for (const t of transactionsForSelectedMonth) {
      if (t.type === "income") income += t.amountInCents
      if (t.type === "expense") expense += t.amountInCents
    }
    return {
      incomeTotal: income,
      expenseTotal: expense,
      balance: income - expense,
    }
  }, [transactionsForSelectedMonth])

  const handleDelete = async (transactionUid: string) => {
    if (confirm("Weet je zeker dat je deze transactie wilt verwijderen?")) {
      try {
        await deleteByUid(siloUid, transactionUid)
        setTransactions(
          (prev) => prev?.filter((t) => t.uid !== transactionUid) ?? [],
        )
      } catch (error) {
        console.error("Fout bij het verwijderen van transactie:", error)
      }
    }
  }

  return (
    <div className="mx-auto grid w-fit grid-cols-2 gap-8 p-6">
      <div className="mx-auto p-6">
        <div className="mb-4 flex items-center justify-between">
          <Link
            className="underline"
            href="/silo"
          >
            Terug naar silo overzicht
          </Link>
          <Link
            className="underline"
            href={`/silo/${siloUid}/transactions/create`}
          >
            Nieuwe transactie aanmaken
          </Link>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-center text-xl font-bold">
            Transacties voor {silo?.name ?? "(naam onbekend)"}
          </h1>

          <Select
            name="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            options={availableMonths.map((month) => {
              const [year, monthNum] = month.split("-")
              return {
                value: month,
                label: `${monthNum}-${year}`,
              }
            })}
            width="w-fit"
          />
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell header>Datum</TableCell>
                <TableCell header>EUR</TableCell>
                <TableCell header>Categorie</TableCell>
                <TableCell header> </TableCell>
              </TableRow>
            </TableHead>
            <tbody>
              {transactionsForSelectedMonth.length > 0 ? (
                transactionsForSelectedMonth.map((transaction) => (
                  <TransactionRow
                    key={transaction.uid}
                    transaction={transaction}
                    onDelete={handleDelete}
                    siloUid={siloUid}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center"
                  >
                    Geen transacties gevonden voor deze maand.
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </Table>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <TotalsCard
            label="Totale inkomsten"
            amount={"+" + centsToCurrency(incomeTotal)}
          />
          <TotalsCard
            label="Totale uitgaven"
            amount={"-" + centsToCurrency(expenseTotal)}
          />
          <TotalsCard
            label="Balans"
            amount={centsToCurrency(balance)}
          />
        </div>
      </div>

      <CategoriesColumn
        categories={categories}
        siloUid={siloUid}
      />
    </div>
  )
}

function CategoriesColumn({
  categories,
  siloUid,
}: {
  categories: Category[]
  siloUid: string
}) {
  return (
    <div className="mx-auto p-6">
      <Link
        href={`/silo/${siloUid}/category/create`}
        className="underline"
      >
        Voeg categorie toe
      </Link>
      <h2 className="mt-4 text-lg font-bold">Categorieën</h2>
      <div className="mt-2">
        {categories && categories.length > 0 ? (
          // Display categories in horizontal cards
          <div className="grid grid-cols-3 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.uid}
                category={category}
                siloUid={siloUid}
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

// TODO: Na verwijderen van transactie, de categorieën herladen om de totale uitgaven te updaten
function CategoryCard({
  category,
  siloUid,
}: {
  category: Category
  siloUid: string
}) {
  const [totalExpense, setTotalExpense] = useState<number | null>(null)

  useEffect(() => {
    if (category.uid) {
      getCategoryExpenseTotalCents(siloUid, category.uid)
        .then((total) => {
          setTotalExpense(total)
        })
        .catch((error) => {
          console.error("Fout bij het ophalen van totale uitgaven:", error)
        })
    }
  }, [category.uid, siloUid])

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
    <div
      key={category.uid}
      className={`space-y-2 rounded-lg border p-4`}
    >
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

function TransactionRow({
  transaction,
  onDelete,
  siloUid,
}: {
  transaction: Transaction
  onDelete: (uid: string) => void
  siloUid: string
}) {
  const [category, setCategory] = useState<Category | null>(null)
  useEffect(() => {
    if (transaction.categoryUid) {
      getCategoryByUid(siloUid, transaction.categoryUid)
        .then((category) => {
          setCategory(category)
        })
        .catch((error) => {
          console.error("Fout bij het ophalen van categorie:", error)
        })
    }
  }, [siloUid, transaction.categoryUid])

  return (
    <TableRow>
      <TableCell>{formatDate(transaction.createdAt)}</TableCell>
      <TableCell>
        {(transaction.type === "income" ? "+" : "-") +
          centsToCurrency(transaction.amountInCents)}
      </TableCell>
      <TableCell>{category ? category.name : "Geen categorie"}</TableCell>
      <TableCell className="text-right">
        <Link href={`/silo/${siloUid}/transactions/${transaction.uid}/edit`}>
          <IconButton icon={<PencilLine />} />
        </Link>
        <IconButton
          icon={<Trash2 />}
          onClick={() => onDelete(transaction.uid)}
        />
      </TableCell>
    </TableRow>
  )
}

function TotalsCard({ label, amount }: { label: string; amount: string }) {
  return (
    <div className={`rounded-lg border p-4`}>
      <p className={`text-sm`}>{label}</p>
      <strong className={`text-xl`}>EUR {amount}</strong>
    </div>
  )
}
