"use client"

import { getByUid } from "@/lib/silo/silo"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState, ReactNode } from "react"
import LoadingState from "../ui/LoadingState"

export default function SiloGuard({ children }: { children: ReactNode }) {
  const params = useParams()
  const router = useRouter()
  const siloUid = params?.uid as string
  const [loading, setLoading] = useState(true)
  const [exists, setExists] = useState<boolean | null>(null)

  useEffect(() => {
    const checkSilo = async () => {
        const silo = await getByUid(siloUid)
        setExists(!!silo)
        setLoading(false)
        if (!silo) {
            router.replace("/silo")
        }
    }
    if (siloUid) checkSilo()
  }, [siloUid, router])

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
