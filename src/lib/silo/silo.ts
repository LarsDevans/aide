import { db } from "@/lib/firebase"
import { Silo } from "@/types/silo"
import { FirebaseError } from "firebase/app"
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore"
import { Observable } from "rxjs"
import { uid } from "uid"

export const documentName = "silos"

export async function getByUid(uid: string): Promise<Silo | null> {
  try {
    const docRef = doc(db, documentName, uid)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? (docSnap.data() as Silo) : null
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error("Firebase foutmelding, details in console:", error.code)
    } else {
      console.error("Er is een onbeschrijfelijke fout opgetreden")
    }
    return null
  }
}

export function listenForByOwnerUid$(ownerUid: string): Observable<Silo[]> {
  return new Observable<Silo[]>((subscriber) => {
    const q = query(
      collection(db, documentName),
      where("ownerUid", "==", ownerUid),
    )

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const silos: Silo[] = []
        querySnapshot.forEach((doc) => {
          silos.push(doc.data() as Silo)
        })
        subscriber.next(silos)
      },
      (error) => {
        console.error("Firebase foutmelding, details in console:", error.code)
        subscriber.error(error)
      },
    )

    return () => unsubscribe()
  })
}

export async function create(
  name: string,
  ownerUid: string,
  description?: string,
): Promise<Silo | null> {
  try {
    const silo: Silo = {
      uid: uid(32),
      name,
      description,
      isArchived: false,
      ownerUid,
    }
    await setDoc(doc(db, documentName, String(silo.uid)), silo)
    return silo
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
  uid: string,
  nextSilo: Silo,
): Promise<Silo | null> {
  try {
    const docRef = doc(db, documentName, uid)
    await updateDoc(docRef, nextSilo)
    return nextSilo
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error("Firebase foutmelding, details in console:", error.code)
    } else {
      console.error("Er is een onbeschrijfelijke fout opgetreden")
    }
    return null
  }
}

export async function archive(uid: string): Promise<Silo | null> {
  const silo = await getByUid(uid)
  if (silo !== null) {
    return await update(uid, { ...silo, isArchived: true })
  }
  return null
}

export async function unarchive(uid: string): Promise<Silo | null> {
  const silo = await getByUid(uid)
  if (silo !== null) {
    return await update(uid, { ...silo, isArchived: false })
  }
  return null
}

export function listenForByParticipant$(
  participantEmail: string,
): Observable<Silo[]> {
  return new Observable<Silo[]>((subscriber) => {
    const q = query(
      collection(db, documentName),
      where("participants", "array-contains", participantEmail),
    )

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const silos: Silo[] = []
        querySnapshot.forEach((doc) => {
          silos.push(doc.data() as Silo)
        })
        subscriber.next(silos)
      },
      (error) => {
        console.error("Firebase foutmelding, details in console:", error.code)
        subscriber.error(error)
      },
    )

    return () => unsubscribe()
  })
}

export async function addParticipant(
  uid: string,
  email: string,
): Promise<Silo | null> {
  const silo = await getByUid(uid)
  if (silo !== null) {
    const participants = silo.participants ?? []

    if (participants.includes(email)) {
      return silo
    }

    const newParticipants = [...participants, email]
    return await update(uid, { ...silo, participants: newParticipants })
  }
  return null
}

export async function removeParticipant(
  uid: string,
  email: string,
): Promise<Silo | null> {
  const silo = await getByUid(uid)
  if (silo !== null) {
    const participants = silo.participants ?? []

    if (participants.includes(email)) {
      const newParticipants = participants.filter((p) => p !== email)
      return await update(uid, { ...silo, participants: newParticipants })
    }
  }
  return null
}
