import { ReactNode } from "react"

export default function EmptyState({ cta }: { cta?: ReactNode }) {
  return (
    <div className="rounded border p-4 text-center">
      <span className="text-3xl font-bold">;(</span>
      <p className="pt-4">Hier is vooralsnog niets te zien</p>
      {cta && <div className="pt-4">{cta}</div>}
    </div>
  )
}
