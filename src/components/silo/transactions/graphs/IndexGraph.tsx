import React, { useContext, useEffect, useState } from "react"
import { SiloContext } from "@/contexts/SiloProvider"
import { listenForBySiloUid as listenForTransactions } from "@/lib/silo/transaction"
import { Line } from "react-chartjs-2"
import { getDatasetFromTransactions } from "@/lib/helpers/graph"
import { Transaction } from "@/types/transaction"

export default function TransactionIndexGraph({ month }: { month: number }) {
  const siloCtx = useContext(SiloContext)
  const [transactions, setTransactions] = useState<Transaction[] | null>(null)

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Dagen in de maand",
          font: {
            weight: "bold" as const,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Cumulatief bedrag in EUR",
          font: {
            weight: "bold" as const,
          },
        },
      },
    },
  }

  useEffect(() => {
    if (!siloCtx.siloUid) return
    const unsubscribe = listenForTransactions(siloCtx.siloUid, setTransactions)
    return unsubscribe
  }, [siloCtx.siloUid])

  if (!transactions) return

  return <Line data={getDatasetFromTransactions(month, transactions)} options={options} />
}
