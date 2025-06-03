"use client"

import { ReactNode } from "react"
import LoadingState from "@/components/ui/LoadingState"
import { useSiloAccess } from "@/hooks/useSiloAccess"

export default function SiloGuard({ children }: { children: ReactNode }) {
  const { isLoading, siloExists } = useSiloAccess()

  if (isLoading) {
    return (
      <div className="flex h-full min-h-screen w-full items-center justify-center">
        <LoadingState />
      </div>
    )
  }

  if (!siloExists) {
    return null
  }

  return <>{children}</>
}
