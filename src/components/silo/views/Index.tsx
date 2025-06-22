"use client"

import SiloCtaCreate from "@/components/silo/cta/Create"
import EmptyState from "@/components/ui/EmptyState"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { listenForByOwnerUid$, listenForByParticipant$ } from "@/lib/silo/silo"
import { Silo } from "@/types/silo"
import { User } from "firebase/auth"
import { Crown, PencilLine, Users } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Tooltip } from "react-tooltip"

export default function SiloViewIndex() {
  const [silos, setSilos] = useState<Silo[] | null>(null)
  const currentUser = useCurrentUser()

  useEffect(() => {
    if (!currentUser.uid || !currentUser.email) return

    const combinedMap = new Map<string, Silo>()

    const handleUpdate = (updated: Silo[]) => {
      updated
        .filter((silo) => !silo.isArchived)
        .forEach((silo) => combinedMap.set(silo.uid, silo))
      setSilos(Array.from(combinedMap.values()))
    }

    const unsubByOwner = listenForByOwnerUid$(currentUser.uid).subscribe(
      handleUpdate,
    )
    const unsubByParticipant = listenForByParticipant$(
      currentUser.email,
    ).subscribe(handleUpdate)

    return () => {
      unsubByOwner.unsubscribe()
      unsubByParticipant.unsubscribe()
    }
  }, [currentUser.uid, currentUser.email])

  return (
    <div className="flex w-96 flex-col space-y-2">
      <h1 className="text-center text-xl font-bold">Jouw silos</h1>

      <ul className="space-y-2">
        {silos && silos.length > 0
          ? silos.map((silo) => (
              <SiloItem
                key={silo.uid}
                silo={silo}
                currentUser={currentUser}
              />
            ))
          : silos && <EmptyState cta={<SiloCtaCreate />} />}
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

function SiloItem({ silo, currentUser }: { silo: Silo; currentUser: User }) {
  return (
    <li className="flex items-center justify-between rounded border p-2">
      <Link
        href={`/silo/${silo.uid}`}
        className="w-full flex-1"
      >
        <div className="flex gap-x-2">
          <p className="font-bold">{silo.name}</p>
          {silo.participants && silo.participants.length > 0 && (
            <>
              {currentUser.uid === silo.ownerUid && (
                <div
                  data-tooltip-id="silo-owner-tip"
                  data-tooltip-content="Eigenaar"
                >
                  {silo.participants && <Crown />}
                </div>
              )}
              <div
                data-tooltip-id="silo-tip"
                data-tooltip-content="Gedeelde silo"
              >
                <Users />
              </div>
              <Tooltip id="silo-owner-tip" />
              <Tooltip id="silo-tip" />
            </>
          )}
        </div>
      </Link>
      <Link
        className="px-2"
        href={`/silo/edit/${silo.uid}`}
      >
        <PencilLine />
      </Link>
    </li>
  )
}
