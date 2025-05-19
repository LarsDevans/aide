export type Silo = {
  uid?: string
  name: string
  description?: string
  isArchived?: boolean
  ownerUid?: string
}

export type SiloFormData = {
  name: string
  description: string
}
