import { ReactNode } from "react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <section className="flex h-full min-h-screen w-full items-center justify-center">
      {children}
    </section>
  )
}
