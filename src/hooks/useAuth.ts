"use client"

import { AuthContext } from "@/contexts/AuthProvider"
import { useRouter } from "next/navigation"
import { useContext, useEffect } from "react"

export const useAuth = () => {
  const { currentUser, isLoading } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && currentUser === null) {
      router.push("/auth/login")
    }
  }, [currentUser, router, isLoading])

  return { currentUser, isLoading }
}
