"use client"

import SiloForm from "@/components/silo/SiloForm"
import LoadingState from "@/components/ui/LoadingState"
import { useAuth } from "@/hooks/useAuth"
import { create } from "@/lib/silo"
import { createSchema } from "@/lib/validation/silo"
import { SiloFormData } from "@/types/silo"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SiloViewCreate() {
  const { currentUser } = useAuth()
  const router = useRouter()

  if (currentUser === null) {
    return <LoadingState />
  }

  const createSilo = async (siloFormData: SiloFormData) => {
    const result = await create(
      siloFormData.name,
      siloFormData.description,
      currentUser.uid,
    )
    if (result === null) {
      throw Error("Firebase foutmelding (zie console)")
    }
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

  return (
    <SiloForm
      linkActions={formLinkActions}
      submitText="Silo aanmaken"
      title="Maak een nieuwe silo aan"
      validation={createSchema}
      submitAction={createSilo}
    />
  )
}
