import { Button as ButtonType } from "@/types/ui"

export default function Button({
  disabled = false,
  label,
  type = "submit",
  width = "w-fit",
  onClick,
}: ButtonType) {
  return (
    <button
      className={`${width} cursor-pointer rounded border p-2 font-bold disabled:cursor-not-allowed`}
      disabled={disabled}
      type={type}
      onClick={(e) => onClick && onClick(e)}
    >
      {label}
    </button>
  )
}
