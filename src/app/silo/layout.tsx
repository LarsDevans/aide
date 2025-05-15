import AuthGuard from "@/components/auth/AuthGuard"
import { ReactNode } from "react"

export default function SiloLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <section className="flex h-full min-h-screen w-full items-center justify-center">
        {children}
      </section>
    </AuthGuard>
  )
}
