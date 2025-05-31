import AuthGuard from "@/components/auth/AuthGuard"
import SiloGuard from "@/components/silo/SiloGuard"
import { ReactNode } from "react"

export default function TransactionLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <SiloGuard>
        <section className="flex h-full min-h-screen w-full items-center justify-center">
          {children}
        </section>
      </SiloGuard>
    </AuthGuard>
  )
}
