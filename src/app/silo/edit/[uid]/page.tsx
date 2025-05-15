import SiloLayout from "@/app/silo/layout"
import SiloEditForm from "@/components/silo/SiloEditForm"

export default async function SiloEditPage({
  params,
}: {
  params: Promise<{ uid: string }>
}) {
  const { uid } = await params

  return (
    <SiloLayout>
      <SiloEditForm uid={uid} />
    </SiloLayout>
  )
}
