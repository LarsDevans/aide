"use client"

import { auth } from "@/lib/auth"
import { onAuthStateChanged, User } from "firebase/auth"
import { createContext, ReactNode, useEffect, useState } from "react"

interface AuthContextType {
  currentUser: User | null
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange)
    return () => unsubscribe()
  }, [])

  const handleAuthStateChange = (user: User | null) => {
    setCurrentUser(user)
    setIsLoading(false)
  }

  return (
    <AuthContext.Provider value={{ currentUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
