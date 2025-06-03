"use client"

import React, { createContext, useState, ReactNode } from "react"

type SiloContextType = {
  siloUid: string | null
  setSiloUid: (siloUid: string | null) => void
}

export const SiloContext = createContext<SiloContextType>({} as SiloContextType)

export const SiloProvider = ({ children }: { children: ReactNode }) => {
  const [siloUid, setSiloUid] = useState<string | null>(null)

  return (
    <SiloContext.Provider value={{ siloUid, setSiloUid }}>
      {children}
    </SiloContext.Provider>
  )
}
