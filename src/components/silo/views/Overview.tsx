"use client"

import CategoryViewIndex from "../category/views/Index"
import TransactionViewIndex from "../transactions/views/Index"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
)

export default function SiloOverview({ siloUid }: { siloUid: string }) {
  return (
    <div className="mx-auto grid w-fit grid-cols-2 gap-8 p-6">
      <TransactionViewIndex siloUid={siloUid} />
      <CategoryViewIndex siloUid={siloUid} />
    </div>
  )
}
