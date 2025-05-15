import { ReactNode } from "react"

export default function EmptyState({ cta }: { cta?: ReactNode }) {
  return (
    <div className="border rounded text-center p-4">
      <span className="font-bold text-3xl">;(</span>
      <p className="pt-4">Hier is vooralsnog niets te zien</p>
      {cta && <div className="pt-4">{cta}</div>}
    </div>
  )
}
