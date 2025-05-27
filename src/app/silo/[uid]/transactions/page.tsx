import TransactionIndex from "@/components/silo/transactions/views/Index"

export default async function TransactionIndexPage({
  params,
}: {
  params: Promise<{ uid: string }>
}) {
  const { uid } = await params
  
  return <TransactionIndex siloUid={uid} />
}
