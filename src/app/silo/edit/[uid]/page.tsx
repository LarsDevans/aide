import SiloViewEdit from "@/components/silo/views/Edit"

export default async function SiloEditPage({
  params,
}: {
  params: Promise<{ uid: string }>
}) {
  const { uid } = await params
  return <SiloViewEdit uid={uid} />
}
