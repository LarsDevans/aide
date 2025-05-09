import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/firebase";
import { Silo } from "@/types/silo";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { uid } from "uid";

const documentName = "silos";

export async function getByUid(Uid: string): Promise<Silo> { // eslint-disable-line
  return { uid: "", name: "", description: "", ownerUid: "" };
}

export async function getAll(): Promise<Silo[]> {
  try {
    const collectionRef = collection(db, documentName);
    const querySnap = await getDocs(collectionRef);

    const silos: Silo[] = [];
    querySnap.forEach((doc) => silos.push(doc.data() as Silo));

    return silos;
  } catch (error: any) { // eslint-disable-line
    console.error("Firebase foutmelding, details in console:", error.code);
    return [];
  }
}

export async function create(silo: Silo): Promise<Silo | null> {
  try {
    silo = { ...silo, uid: uid(32), ownerUid: getAuthUser()?.uid };
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
