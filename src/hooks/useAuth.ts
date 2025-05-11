import { auth } from "@/lib/auth";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";

export default function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { currentUser, isLoading };
}
