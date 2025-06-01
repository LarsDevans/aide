import TransactionViewCreate from "@/components/silo/transactions/views/Create"

export default async function TransactionCreatePage({
  params,
}: {
  params: Promise<{ uid: string }>
}) {
  const { uid } = await params
  return <TransactionViewCreate siloUid={uid} />
}
