import { Transaction } from "@/types/transaction"
import { FirebaseError } from "firebase/app"
import {
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  Unsubscribe,
} from "firebase/firestore"
import { uid } from "uid"
import { db } from "@/lib/firebase"
import {
  documentName as siloDocumentName,
  getByUid as getSiloByUid,
} from "@/lib/silo/silo"
import { Silo } from "@/types/silo"
import { collection, getDocs } from "firebase/firestore"

export const documentName = "transactions"

export async function getByUid(
  siloUid: string,
  transactionUid: string,
): Promise<Transaction | null> {
  try {
    const silo: Silo | null = await getSiloByUid(siloUid)

    if (!silo) {
      console.error("Silo not found")
      return null
    }

    const transactionRef = doc(
      db,
      siloDocumentName,
      siloUid,
      documentName,
      transactionUid,
    )

    const transactionDoc = await getDoc(transactionRef)
    if (!transactionDoc.exists()) {
      console.error("Transaction not found")
      return null
    }

    const transaction: Transaction = {
      ...transactionDoc.data(),
      uid: transactionDoc.id,
    } as Transaction

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

export async function getBySiloUid(
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
      documentName,
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

export function listenForBySiloUid(
  siloUid: string,
  callback: (transactions: Transaction[]) => void,
): Unsubscribe {
  const transactionsCol = collection(
    db,
    siloDocumentName,
    siloUid,
    documentName,
  )

  const q = query(transactionsCol)

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const transactions: Transaction[] = snapshot.docs.map((doc) => ({
        ...doc.data(),
        uid: doc.id,
      })) as Transaction[]
      callback(transactions)
    },
    (error) => {
      if (error instanceof FirebaseError) {
        console.error("Firebase foutmelding, details in console:", error.code)
      } else {
        console.error("Er is een onbeschrijfelijke fout opgetreden")
      }
    },
  )

  return unsubscribe
}

export async function create(
  siloUid: string,
  type: "income" | "expense",
  amountInCents: number,
  categoryUid?: string,
): Promise<Transaction | null> {
  try {
    const date = new Date()

    const transaction: Transaction = {
      uid: uid(32),
      type,
      amountInCents,
      createdAt: date,
    }

    if (categoryUid) {
      transaction.categoryUid = categoryUid
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

export async function deleteByUid(
  siloUid: string,
  transactionUid: string,
): Promise<void> {
  try {
    const transactionRef = doc(
      db,
      siloDocumentName,
      siloUid,
      documentName,
      transactionUid,
    )

    await deleteDoc(transactionRef)
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error("Firebase foutmelding, details in console:", error.code)
    } else {
      console.error("Er is een onbeschrijfelijke fout opgetreden")
    }
  }
}

export async function update(
  siloUid: string,
  transactionUid: string,
  nextTransaction: Transaction,
): Promise<Transaction | null> {
  try {
    const docRef = doc(
      db,
      siloDocumentName,
      siloUid,
      documentName,
      transactionUid,
    )

    const transactionToSave = { ...nextTransaction }
    if (transactionToSave.categoryUid === undefined) {
      delete transactionToSave.categoryUid
    }

    await setDoc(docRef, transactionToSave)

    return nextTransaction
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error("Firebase foutmelding, details in console:", error.code)
    } else {
      console.error("Er is een onbeschrijfelijke fout opgetreden")
    }
    return null
  }
}

export async function getByCategoryUid(
  siloUid: string,
  categoryUid: string,
): Promise<Transaction[]> {
  const transactions = await getBySiloUid(siloUid)
  if (!transactions) return []
  return transactions.filter(
    (transaction) => transaction.categoryUid === categoryUid,
  )
}

export async function getCategoryBalanceInCents(
  siloUid: string,
  categoryUid: string,
): Promise<number> {
  const transactions = await getByCategoryUid(siloUid, categoryUid)
  return transactions.reduce((total, transaction) => {
    return transaction.type === "income"
      ? total - transaction.amountInCents
      : total + transaction.amountInCents
  }, 0)
}
