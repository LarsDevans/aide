import { Transaction } from "@/types/transaction"

export type Silo = {
  uid: string
  name: string
  description?: string
  isArchived: boolean
  ownerUid: string
  transactions?: Transaction[]
  participants?: string[]
}

export type SiloFormData = {
  name: string
  description: string
}
