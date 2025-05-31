"use client"

import { ReactNode } from "react"
import LoadingState from "../ui/LoadingState"
import { useSiloAccess } from "@/hooks/useSiloAccess"

export default function SiloGuard({ children }: { children: ReactNode }) {
  const { loading, exists } = useSiloAccess()

  if (loading) {
    return (
      <div className="flex h-full min-h-screen w-full items-center justify-center">
        <LoadingState />
      </div>
    )
  }

  if (!exists) return null

  return <>{children}</>
}
