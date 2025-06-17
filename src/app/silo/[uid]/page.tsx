import SiloOverview from "@/components/silo/views/Overview"

export default async function SiloOverviewPage({
  params,
}: {
  params: Promise<{ uid: string }>
}) {
  const { uid } = await params
  return <SiloOverview siloUid={uid} />
}
