"use client"

import SiloCreateCta from "@/components/silo/SiloCreateCta"
import EmptyState from "@/components/ui/EmptyState"
import { useAuth } from "@/hooks/useAuth"
import { listenForByOwnerUid } from "@/lib/silo"
import { Silo } from "@/types/silo"
import { PencilLine } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function SiloIndex() {
  const [silos, setSilos] = useState<Silo[] | null>(null)
  const { currentUser } = useAuth()

  useEffect(() => {
    const unsubscribe = listenForByOwnerUid(
      currentUser?.uid ?? "",
      (silos: Silo[]) => {
        const activeSilos = silos.filter((silo) => !silo.isArchived)
        setSilos(activeSilos)
      },
    )
    return () => unsubscribe()
  }, [currentUser?.uid])

  return (
    <div className="flex w-96 flex-col space-y-2">
      <h1 className="text-center text-xl font-bold">Jouw silos</h1>

      <ul className="space-y-2">
        {silos && silos.length > 0
          ? silos.map((silo) => (
              <li
                key={silo.uid}
                className="flex items-center justify-between rounded border p-2"
              >
                <div>
                  <p className="font-bold">{silo.name}</p>
                  {silo.description && (
                    <p className="italic">{silo.description}</p>
                  )}
                </div>
                <Link
                  className="px-2"
                  href={`/silo/edit/${silo.uid}`}
                >
                  <PencilLine />
                </Link>
              </li>
            ))
          : silos && <EmptyState cta={<SiloCreateCta />} />}
      </ul>

      <div className="flex justify-between">
        <Link
          className="underline"
          href="/silo/create"
        >
          Nieuwe silo aanmaken
        </Link>
        <Link
          className="underline"
          href="/silo/archive"
        >
          Naar archief
        </Link>
      </div>
    </div>
  )
}
