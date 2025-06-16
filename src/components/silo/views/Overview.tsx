import CategoryViewIndex from "../category/views/Index"
import TransactionViewIndex from "../transactions/views/Index"

export default function SiloOverview({ siloUid }: { siloUid: string }) {
  return (
    <div className="mx-auto grid w-fit grid-cols-2 gap-8 p-6">
      <TransactionViewIndex siloUid={siloUid} />
      <CategoryViewIndex siloUid={siloUid} />
    </div>
  )
}
