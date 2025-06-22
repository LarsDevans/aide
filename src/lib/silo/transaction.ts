import { Transaction } from "@/types/transaction"
import { FirebaseError } from "firebase/app"
import {
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
} from "firebase/firestore"
import { uid } from "uid"
import { db } from "@/lib/firebase"
import {
  documentName as siloDocumentName,
  getByUid as getSiloByUid,
} from "@/lib/silo/silo"
import { collection, getDocs } from "firebase/firestore"
import { getByUid as getCategoryByUid } from "@/lib/silo/category"
import { catchError, firstValueFrom, from, map, Observable, of, switchMap } from "rxjs"
import { Silo } from "@/types/silo"

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

export function getTransactionsBySiloUid$(
  siloUid: string,
): Observable<Transaction[] | null> {
  return from(getSiloByUid(siloUid)).pipe(
    switchMap((silo) => {
      if (!silo) {
        console.error("Silo not found")
        return of(null)
      }
      const transactionsCol = collection(
        db,
        siloDocumentName,
        siloUid,
        documentName,
      )
      return from(getDocs(transactionsCol)).pipe(
        map(
          (snapshot) =>
            snapshot.docs.map((doc) => ({
              ...doc.data(),
              uid: doc.id,
            })) as Transaction[],
        ),
      )
    }),
    catchError((error) => {
      if (error instanceof FirebaseError) {
        console.error("Firebase foutmelding, details in console:", error.code)
      } else {
        console.error("Er is een onbeschrijfelijke fout opgetreden")
      }
      return of(null)
    }),
  )
}

export function listenForBySiloUid$(
  siloUid: string,
): Observable<Transaction[]> {
  return new Observable<Transaction[]>((subscriber) => {
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
        subscriber.next(transactions)
      },
      (error) => {
        if (error instanceof FirebaseError) {
          console.error("Firebase foutmelding, details in console:", error.code)
          subscriber.error(error)
        } else {
          console.error("Er is een onbeschrijfelijke fout opgetreden")
          subscriber.error(error)
        }
      },
    )

    return () => unsubscribe()
  })
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
  const transactions = await firstValueFrom(getTransactionsBySiloUid$(siloUid))

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

export async function assignCategory(
  siloUid: string,
  transactionUid: string,
  categoryUid: string,
) {
  const transaction = await getByUid(siloUid, transactionUid)
  const category = await getCategoryByUid(siloUid, categoryUid)

  if (!transaction || !category) return

  await update(siloUid, transactionUid, {
    uid: transaction.uid,
    type: transaction.type,
    amountInCents: transaction.amountInCents,
    createdAt: transaction.createdAt,
    categoryUid: category?.uid ?? transaction.categoryUid ?? "",
  })
}
