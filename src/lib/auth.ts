import { app } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  UserCredential
} from "firebase/auth";

const auth = getAuth(app);

export async function signUp(
  email: string,
  password: string
): Promise<UserCredential | null> {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error: any) { // eslint-disable-line
    console.error("Firebase foutmelding, details in console:", error.code);
    return null;
  }
}

export async function signIn(
  email: string,
  password: string
): Promise<UserCredential | null> {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) { // eslint-disable-line
    console.error("Firebase foutmelding, details in console:", error.code);
    return null;
  }
}
