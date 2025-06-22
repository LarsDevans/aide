import { Category } from "@/types/category"
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore"
import { uid } from "uid"
import { db } from "../firebase"
import { documentName as siloDocumentName } from "@/lib/silo/silo"
import { FirebaseError } from "firebase/app"
import { Observable } from "rxjs"

export const documentName = "categories"

export async function create(
  siloUid: string,
  name: string,
  budgetedAmountInCents: number,
  endDate?: Date | null,
): Promise<Category | null> {
  try {
    const category: Category = {
      uid: uid(32),
      name,
      budgetedAmountInCents,
    }

    if (endDate) {
      category.endDate = endDate
    }

    // Categories is a subcollection of silo
    const siloRef = doc(db, siloDocumentName, siloUid)
    const categoryRef = doc(siloRef, documentName, category.uid)

    await setDoc(categoryRef, category)

    return category
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error("Firebase foutmelding, details in console:", error.code)
    } else {
      console.error("Er is een onbeschrijfelijke fout opgetreden")
    }
    return null
  }
}

export function listenForBySiloUid$(siloUid: string): Observable<Category[]> {
  return new Observable<Category[]>((subscriber) => {
    const categoryCol = collection(db, siloDocumentName, siloUid, documentName)
    const q = query(categoryCol)

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const categories: Category[] = snapshot.docs.map((doc) => ({
          ...doc.data(),
          uid: doc.id,
        })) as Category[]
        subscriber.next(categories)
      },
      (error) => {
        if (error instanceof FirebaseError) {
          console.error("Firebase foutmelding, details in console:", error.code)
        } else {
          console.error("Er is een onbeschrijfelijke fout opgetreden")
        }
        subscriber.error(error)
      },
    )

    return () => unsubscribe()
  })
}

export async function getByUid(
  siloUid: string,
  categoryUid: string,
): Promise<Category | null> {
  try {
    const siloRef = doc(db, siloDocumentName, siloUid)
    const categoryRef = doc(siloRef, documentName, categoryUid)
    const docSnap = await getDoc(categoryRef)

    if (docSnap.exists()) {
      return { ...docSnap.data(), uid: docSnap.id } as Category
    } else {
      return null
    }
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error("Firebase foutmelding, details in console:", error.code)
    } else {
      console.error("Er is een onbeschrijfelijke fout opgetreden")
    }
    return null
  }
}

export async function update(
  siloUid: string,
  categoryUid: string,
  category: Category,
): Promise<Category | null> {
  try {
    const siloRef = doc(db, siloDocumentName, siloUid)
    const categoryRef = doc(siloRef, documentName, categoryUid)

    await setDoc(categoryRef, category)

    return category
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
  categoryUid: string,
): Promise<void> {
  try {
    const categoryRef = doc(
      db,
      siloDocumentName,
      siloUid,
      documentName,
      categoryUid,
    )

    await deleteDoc(categoryRef)
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error("Firebase foutmelding, details in console:", error.code)
    } else {
      console.error("Er is een onbeschrijfelijke fout opgetreden")
    }
  }
}
