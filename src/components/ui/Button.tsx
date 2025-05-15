import { Button as ButtonType } from "@/types/ui"

export default function Button({
  disabled = false,
  label,
  type = "button",
  width = "w-fit",
  onClick
}: ButtonType) {
  return (
    <button
      className={`${width} border p-2 rounded cursor-pointer disabled:cursor-not-allowed font-bold`}
      disabled={disabled}
      type={type}
      onClick={(e) => onClick && onClick(e)}
    >
      {label}
    </button>
  )
}
