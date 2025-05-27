"use client";

import { Transaction } from "@/types/transaction";
import { listenForBySiloUid } from "@/lib/silo/transaction";
import { getByUid } from "@/lib/silo/silo";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Silo } from "@/types/silo";

export default function TransactionIndex({ siloUid }: { siloUid: string }) {
    const [transactions, setTransactions] = useState<Transaction[] | null>(null);
    const [silo, setSilo] = useState<Silo | null>(null);

    useEffect(() => {
        const unsubscribe = async () => {
            await listenForBySiloUid(
                siloUid,
                (transactions: Transaction[]) => {
                    setTransactions(transactions);
                }
            );
        }
        unsubscribe();
      }, [siloUid])

    useEffect(() => {
        const fetchSilo = async () => {
            const silo = await getByUid(siloUid)
            if (silo) {
                setSilo(silo);
            } else {
                console.error("Silo not found");
            }
        };
        fetchSilo();
    }, [siloUid]);

    return (
        <div>
            <div className="flex w-96 flex-col text-center space-y-2">
                <Link
                    className="underline"
                    href={`/silo`}
                >
                    Terug naar silo overzicht
                </Link>
                <h1 className="text-center text-xl font-bold">
                    Transacties voor Silo {silo?.name ?? ""}
                </h1>
                <ul className="space-y-2">
                    {transactions && transactions.length > 0 ? (
                        transactions.map((transaction) => {
                            return (
                                <li
                                    key={transaction.uid}
                                    className="flex items-center justify-between rounded border p-2"
                                >
                                    <div className="flex-1 w-full">
                                        <p className="font-bold">
                                            {transaction.amountInCents} 
                                            {transaction.type === "income" ? "Inkomen" : "Uitgave"}
                                        </p>
                                        <span>{transaction.date}</span>
                                    </div>
                                </li>
                            );
                        })
                    ) : (
                        <p>Geen transacties gevonden.</p>
                    )}
                </ul>
            </div>

            <div className="flex justify-between">
                <Link
                    className="underline"
                    href={`/silo/${siloUid}/transactions/create`}
                >
                    Nieuwe transactie aanmaken
                </Link>
            </div>
        </div>
    )
}
