import { Transaction } from "@/types/transaction"
import { FirebaseError } from "firebase/app"
import { doc, onSnapshot, query, setDoc, Unsubscribe } from "firebase/firestore"
import { uid } from "uid"
import { db } from "../firebase"
import { documentName as siloDocumentName } from "./silo"
import { Silo } from "@/types/silo"
import { getByUid as getSiloByUid } from "./silo"

export const documentName = "transactions"

import { collection, getDocs } from "firebase/firestore"

export async function getByUid(
  siloUid: string,
): Promise<Transaction[] | null> {
  try {
    const silo: Silo | null = await getSiloByUid(siloUid)
    if (!silo) {
      console.error("Silo not found")
      return null
    }
    const transactionsCol = collection(
      db,
      siloDocumentName,
      siloUid,
      documentName
    )
    const snapshot = await getDocs(transactionsCol)
    const transactions: Transaction[] = snapshot.docs.map((doc) => ({
      ...doc.data(),
      uid: doc.id,
    })) as Transaction[]
    return transactions
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error("Firebase foutmelding, details in console:", error.code)
    } else {
      console.error("Er is een onbeschrijfelijke fout opgetreden")
    }
    return null
  }
}

export async function listenForBySiloUid(
  siloUid: string,
  callback: (transactions: Transaction[]) => void,
): Promise<Unsubscribe> {
  const silo: Silo | null = await getSiloByUid(siloUid)
  if (!silo) {
    console.error("Silo not found")
    return () => {}
  }
  const transactionsCol = collection(
    db,
    siloDocumentName,
    siloUid,
    documentName
  )
  const q = query(transactionsCol)
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const transactions: Transaction[] = snapshot.docs.map((doc) => ({
      ...doc.data(),
      uid: doc.id,
    })) as Transaction[]
    callback(transactions)
  }, (error) => {
    if (error instanceof FirebaseError) {
      console.error("Firebase foutmelding, details in console:", error.code)
    } else {
      console.error("Er is een onbeschrijfelijke fout opgetreden")
    }
  })
  return unsubscribe
}

export async function create(
    siloUid: string,
    type: "income" | "expense",
    amountInCents: number
): Promise<Transaction | null> {
  try {
    const transaction: Transaction = {
        uid: uid(32),
        type,
        amountInCents,
        date: new Date().toLocaleDateString("nl-NL", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
    }
    // transaction is collection inside the silo collection
    const siloRef = doc(db, siloDocumentName, siloUid)
    const transactionRef = doc(siloRef, documentName, transaction.uid)
    await setDoc(transactionRef, transaction)
    return transaction
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error("Firebase foutmelding, details in console:", error.code)
    } else {
      console.error("Er is een onbeschrijfelijke fout opgetreden")
    }
    return null
  }
}