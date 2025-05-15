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
  type: "text" | "email" | "password"
  value?: string | undefined
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export interface IconButton {
  disabled?: boolean
  icon: ReactNode
  type?: "button" | "submit"
  onClick?: (e: FormEvent<HTMLButtonElement>) => void
}
