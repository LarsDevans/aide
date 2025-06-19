"use client"

import SiloGuard from "@/components/silo/SiloGuard"
import { ReactNode } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

export default function TransactionLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <SiloGuard>
      <DndProvider backend={HTML5Backend}>
        <section className="flex h-full min-h-screen w-full items-center justify-center">
          {children}
        </section>
      </DndProvider>
    </SiloGuard>
  )
}
