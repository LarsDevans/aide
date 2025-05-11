import { db } from "@/lib/firebase";
import { Silo } from "@/types/silo";
import { Unsubscribe } from "firebase/auth";
import { collection, doc, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { uid } from "uid";

const documentName = "silos";

export async function getByUid(Uid: string): Promise<Silo> { // eslint-disable-line
  return { uid: "", name: "", description: "", ownerUid: "" };
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

export async function create(silo: Silo, ownerUid: string): Promise<Silo | null> {
  try {
    silo = { ...silo, uid: uid(32), ownerUid: ownerUid};
    await setDoc(doc(db, documentName, String(silo.uid)), silo);
    return silo;
  } catch (error: any) { // eslint-disable-line
    console.error("Firebase foutmelding, details in console:", error.code);
    return null;
  }
}

export async function update(silo: Silo): Promise<Silo> { // eslint-disable-line
  return { uid: "", name: "", description: "", ownerUid: "" };
}
