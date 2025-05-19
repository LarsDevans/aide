"use client"

import SiloForm from "@/components/silo/SiloForm"
import Button from "@/components/ui/Button"
import LoadingState from "@/components/ui/LoadingState"
import { archive, getByUid, update } from "@/lib/silo"
import { updateSchema } from "@/lib/validation/silo"
import { Silo, SiloFormData } from "@/types/silo"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function SiloViewEdit({ uid }: { uid: string }) {
  const [silo, setSilo] = useState<Silo | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchSilo = async () => {
      const silo = await getByUid(uid)
      setSilo(silo)
    }
    fetchSilo()
  }, [uid])

  const updateSilo = async (siloFormData: SiloFormData) => {
    const result = await update(uid, {
      name: siloFormData.name,
      description: siloFormData.description,
    })
    if (result === null) {
      throw Error("Firebase foutmelding (zie console)")
    }
    router.push("/silo")
  }

  const archiveSilo = async () => {
    await archive(silo?.uid ?? "")
    router.push("/silo")
  }

  const formLinkActions = (
    <Link
      className="underline"
      href="/silo"
    >
      Annuleren
    </Link>
  )

  const formButtonActions = (
    <Button
      label="Archiveren"
      type="button"
      onClick={archiveSilo}
    />
  )

  // To prevent empty input fields, we make sure the silo is loaded.
  if (silo === null) {
    return <LoadingState />
  }

  return (
    <SiloForm
      buttonActions={formButtonActions}
      initialFormData={{
        name: silo.name,
        description: silo.description ?? "",
      }}
      linkActions={formLinkActions}
      submitText="Silo aanpassen"
      title="Pas de silo gegevens aan"
      validation={updateSchema}
      submitAction={updateSilo}
    />
  )
}
