"use client"

import Button from "@/components/ui/Button"
import EmptyState from "@/components/ui/EmptyState"
import { useAuth } from "@/hooks/useAuth"
import { listenForByOwnerUid, unarchive } from "@/lib/silo"
import { Silo } from "@/types/silo"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function SiloArchive() {
  const [silos, setSilos] = useState<Silo[] | null>(null)
  const { currentUser } = useAuth()

  useEffect(() => {
    const unsubscribe = listenForByOwnerUid(
      currentUser?.uid ?? "",
      (silos: Silo[]) => {
        const archivedSilos = silos.filter((silo) => silo.isArchived)
        setSilos(archivedSilos)
      }
    )
    return () => unsubscribe()
  }, [currentUser?.uid])

  const unarchiveSilo = async (silo: Silo) => {
    await unarchive(silo?.uid ?? "")
  }

  return (
    <div className="flex flex-col w-96">

      <h1 className="text-center font-bold text-lg">Jouw silo archief</h1>

      <ul>
        {silos && silos.length > 0 ? (
          silos.map((silo) => (
            <li
              key={silo.uid}
              className="border p-2 flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{silo.name}</p>
                {silo.description && <p className="italic">{silo.description}</p>}
              </div>
              <div className="space-x-2">
                <Button label="Dearchiveren" onClick={() => unarchiveSilo(silo)} />
              </div>
            </li>
          ))
        ) : (
          silos && <EmptyState />
        )}
      </ul>

      <Link className="underline" href="/silo">
        Terug naar overzicht
      </Link>

    </div>
  )
}
