"use client"

import EmptyState from "@/components/ui/EmptyState"
import { useAuth } from "@/hooks/useAuth"
import { listenForByOwnerUid, unarchive } from "@/lib/silo"
import { Silo } from "@/types/silo"
import { ArchiveRestore } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import IconButton from "../../ui/IconButton"

export default function SiloViewArchive() {
  const [silos, setSilos] = useState<Silo[] | null>(null)
  const { currentUser } = useAuth()

  useEffect(() => {
    const unsubscribe = listenForByOwnerUid(
      currentUser?.uid ?? "",
      (silos: Silo[]) => {
        const archivedSilos = silos.filter((silo) => silo.isArchived)
        setSilos(archivedSilos)
      },
    )
    return () => unsubscribe()
  }, [currentUser?.uid])

  const unarchiveSilo = async (silo: Silo) => {
    await unarchive(silo?.uid ?? "")
  }

  return (
    <div className="flex w-96 flex-col space-y-2">
      <h1 className="text-center text-xl font-bold">Jouw silo archief</h1>

      <ul className="space-y-2">
        {silos && silos.length > 0
          ? silos.map((silo) => (
              <li
                key={silo.uid}
                className="flex items-center justify-between rounded border p-2"
              >
                <div className="w-full">
                  <p className="font-bold">{silo.name}</p>
                  {silo.description && (
                    <p className="italic">{silo.description}</p>
                  )}
                </div>
                <IconButton
                  icon={<ArchiveRestore />}
                  type="button"
                  onClick={() => unarchiveSilo(silo)}
                />
              </li>
            ))
          : silos && <EmptyState />}
      </ul>

      <Link
        className="w-fit underline"
        href="/silo"
      >
        Terug naar overzicht
      </Link>
    </div>
  )
}
