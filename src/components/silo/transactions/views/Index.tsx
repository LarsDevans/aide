"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Table,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/Table";
import Select from "@/components/ui/Select";
import { Trash2 } from "lucide-react";
import { Transaction } from "@/types/transaction";
import { Silo } from "@/types/silo";
import { deleteByUid, listenForBySiloUid } from "@/lib/silo/transaction";
import { getByUid } from "@/lib/silo/silo";
import Link from "next/link";
import IconButton from "@/components/ui/IconButton";

const getMonth = (dateStr: string): string => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, month, year] = dateStr.split('-');
    return !year || !month ? '' : `${month.padStart(2, '0')}-${year}`;
};

const centsToEuro = (cents: number): string => {
    return `${(cents / 100).toFixed(2).replace('.', ',')}`;
}

export default function TransactionIndex({ siloUid }: { siloUid: string }) {
    const [transactions, setTransactions] = useState<Transaction[] | null>(null);
    const [silo, setSilo] = useState<Silo | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string>("");

    useEffect(() => {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        setSelectedMonth(`${month}-${year}`);
    }, []);

    useEffect(() => {
        const unsubscribe = listenForBySiloUid(
            siloUid,
            (transactions: Transaction[]) => {
                setTransactions(transactions);
            }
        );
        return () => unsubscribe();
    }, [siloUid]);


    useEffect(() => {
        const fetchSilo = async () => {
            const silo = await getByUid(siloUid);
            if (silo) setSilo(silo);
            else console.error("Silo not found");
        };
        fetchSilo();
    }, [siloUid]);

    const filteredTransactions = React.useMemo(() =>
        (transactions?.filter(t => getMonth(t.date) === selectedMonth) || [])
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        [transactions, selectedMonth]
    );

    const allMonths = React.useMemo(() => [
        ...new Set((transactions ?? []).map(t => getMonth(t.date))),
    ].sort((a, b) => b.localeCompare(a)), [transactions]);

    const totals = React.useMemo(() => {
        const incomeTotal = filteredTransactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amountInCents), 0);

        const expenseTotal = filteredTransactions
            .filter(t => t.type === "expense")
            .reduce((sum, t) => sum + Number(t.amountInCents), 0);
        
        return {
            incomeTotal,
            expenseTotal,
            balance: incomeTotal - expenseTotal,
        };
    }, [filteredTransactions]);

    const handleDelete = async (transactionUid: string) => {
        if (confirm("Weet je zeker dat je deze transactie wilt verwijderen?")) {
            try {
                await deleteByUid(siloUid, transactionUid);
                setTransactions(prev => prev?.filter(t => t.uid !== transactionUid) || []);
            } catch (error) {
                console.error("Fout bij het verwijderen van transactie:", error);
            }
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-6">
            <div className="mb-4 flex justify-between items-center">
                <Link className="underline" href="/silo">
                    Terug naar silo overzicht
                </Link>
                <Link className="underline" href={`/silo/${siloUid}/transactions/create`}>
                    Nieuwe transactie aanmaken
                </Link>
            </div>

            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-center text-xl font-bold">
                    Transacties voor {silo?.name ?? "(naam onbekend)"}
                </h1>

                {allMonths.length === 0 ? (
                    <p className="text-sm">
                        Geen transacties gevonden voor deze silo.
                    </p>
                ) : (
                    <Select
                        name="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        options={allMonths.map(month => ({
                            value: month,
                            label: month
                        }))}
                        wFit={true}
                    />
                )}
            </div>

            <div className="rounded-lg border">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell header>Datum</TableCell>
                            <TableCell header>EUR</TableCell>
                            <TableCell header className="text-right">Actie</TableCell>
                        </TableRow>
                    </TableHead>
                    <tbody>
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map(transaction => (
                                <TransactionRow
                                    key={transaction.uid}
                                    transaction={transaction}
                                    onDelete={handleDelete}
                                />
                            ))
                            ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    Geen transacties gevonden voor deze maand.
                                </TableCell>
                            </TableRow>
                        )}
                    </tbody>
                </Table>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
                <TotalsCard label="Totale inkomsten" amount={"+" + centsToEuro(totals.incomeTotal)} />
                <TotalsCard label="Totale uitgaven" amount={"-" + centsToEuro(totals.expenseTotal)} />
                <TotalsCard label="Balans" amount={centsToEuro(totals.balance)} />
            </div>
        </div>
    );
}

function TransactionRow({
    transaction,
    onDelete,
}: {
    transaction: Transaction;
    onDelete: (uid: string) => void;
}) {
    return (
        <TableRow>
            <TableCell>{transaction.date}</TableCell>
            <TableCell>
                {(transaction.type === "income" ? "+" : "-")}{centsToEuro(transaction.amountInCents)}
            </TableCell>
            <TableCell className="text-right">
                <IconButton icon={<Trash2 />} onClick={() => onDelete(transaction.uid)} />
            </TableCell>
        </TableRow>
    );
}

function TotalsCard({
    label,
    amount,
}: {
    label: string;
    amount: string;
}) {
    return (
        <div className={`rounded-lg p-4 border`}>
            <p className={`text-sm`}>{label}</p>
            <strong className={`text-xl`}>
                EUR {amount}
            </strong>
        </div>
    );
}
