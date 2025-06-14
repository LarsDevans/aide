import { Category } from "@/types/category"
import { doc, setDoc } from "firebase/firestore"
import { uid } from "uid"
import { db } from "../firebase"
import { documentName as siloDocumentName } from "@/lib/silo/silo"
import { FirebaseError } from "firebase/app"

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

    // categories is collection inside the silo collection
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
