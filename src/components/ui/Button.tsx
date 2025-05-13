import { Button as ButtonType } from "@/types/ui"

export default function Button({
  disabled = false,
  label,
  type = "button",
  onClick
}: ButtonType) {
  return (
    <button
      className="border cursor-pointer disabled:cursor-not-allowed"
      disabled={disabled}
      type={type}
      onClick={(e) => onClick && onClick(e)}
    >
      {label}
    </button>
  )
}
