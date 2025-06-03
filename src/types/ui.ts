import { ChangeEvent, FormEvent, ReactNode } from "react"

export interface Button {
  disabled?: boolean
  label: string | ReactNode
  type?: "button" | "submit"
  width?: "w-fit" | "w-full"
  onClick?: (e: FormEvent<HTMLButtonElement>) => void
}

export interface Input {
  name: string
  placeholder: string
  type: "text" | "email" | "password" | "number"
  value?: string | number | undefined
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  step?: string
}

export interface IconButton {
  disabled?: boolean
  icon: ReactNode
  type?: "button" | "submit"
  onClick?: (e: FormEvent<HTMLButtonElement>) => void
}

export interface Select {
  name: string
  options: { value: string; label: string }[]
  value?: string
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
  width?: "w-fit" | "w-full"
}
