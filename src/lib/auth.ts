import { app } from "@/lib/firebase"
import { FirebaseError } from "firebase/app"
import {
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  User,
  UserCredential,
} from "firebase/auth"

export const auth = getAuth(app)

export function getCurrentUser(): User | null {
  return auth.currentUser
}

export function getCurrentUserUid(): string | undefined {
  return getCurrentUser()?.uid
}

export async function signUp(
  email: string,
  password: string,
): Promise<UserCredential | null> {
  try {
    return await createUserWithEmailAndPassword(auth, email, password)
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error("Firebase foutmelding, details in console:", error.code)
    } else {
      console.error("Er is een onbeschrijfelijke fout opgetreden")
    }
    return null
  }
}

export async function signIn(
  email: string,
  password: string,
): Promise<UserCredential | null> {
  return await setPersistence(auth, browserSessionPersistence)
    .then(async () => {
      return await signInWithEmailAndPassword(auth, email, password)
    })
    .catch((error: unknown) => {
      if (error instanceof FirebaseError) {
        console.error("Firebase foutmelding, details in console:", error.code)
      } else {
        console.error("Er is een onbeschrijfelijke fout opgetreden")
      }
      return null
    })
}
