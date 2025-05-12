import { db } from "@/lib/firebase";
import { Silo } from "@/types/silo";
import { Unsubscribe } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore";
import { uid } from "uid";

const documentName = "silos";

export async function getByUid(uid: string): Promise<Silo | null> {
  try {
    const docRef = doc(db, documentName, uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as Silo : null;
  } catch (error: any) { // eslint-disable-line
    console.error("Firebase foutmelding, details in console:", error.code);
    return null;
  }
}

export function listenForByOwnerUid(
  ownerUid: string,
  callback: (silos: Silo[]) => void
): Unsubscribe {
  const q = query(
    collection(db, documentName),
    where("ownerUid", "==", ownerUid)
  );
  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const silos: Silo[] = [];
      querySnapshot.forEach((doc) => {
        silos.push(doc.data() as Silo);
      });
      callback(silos);
    },
    (error) => {
      console.error("Firebase foutmelding, details in console:", error.code);
    }
  );
  return unsubscribe;
}

export async function create(
  silo: Silo,
  ownerUid: string
): Promise<Silo | null> {
  try {
    silo = { ...silo, uid: uid(32), ownerUid: ownerUid};
    await setDoc(doc(db, documentName, String(silo.uid)), silo);
    return silo;
  } catch (error: any) { // eslint-disable-line
    console.error("Firebase foutmelding, details in console:", error.code);
    return null;
  }
}

export async function update(
  uid: string,
  nextSilo: Silo
): Promise<Silo | null> {
  try {
    const docRef = doc(db, documentName, uid);
    await updateDoc(docRef, nextSilo);
    return nextSilo;
  } catch (error: any) { // eslint-disable-line
    console.error("Firebase foutmelding, details in console:", error.code);
    return null;
  }
}
