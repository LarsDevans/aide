"use client"

import LoadingState from "@/components/ui/LoadingState"
import { useAuth } from "@/hooks/useAuth"
import { ReactNode } from "react"

export default function AuthGuard({ children }: { children: ReactNode}) {
  const { currentUser, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-full min-h-screen">
        <LoadingState />
      </div>
    )
  }

  // Prevent the children to render whilst directing to the sign in page.
  if (currentUser === null) {
    return null
  }

  return <>{children}</>
}
