import TransactionViewEdit from "@/components/silo/transactions/views/Edit"

export default async function TransactionEditPage({
  params,
}: {
  params: Promise<{ uid: string; transactionUid: string }>
}) {
  const { uid, transactionUid } = await params
  return (
    <TransactionViewEdit
      siloUid={uid}
      transactionUid={transactionUid}
    />
  )
}
