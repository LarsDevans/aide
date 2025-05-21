import { IconButton as IconButtonType } from "@/types/ui"

export default function IconButton({
  disabled = false,
  icon,
  type = "submit",
  onClick,
}: IconButtonType) {
  return (
    <button
      className="cursor-pointer p-2 disabled:cursor-not-allowed"
      disabled={disabled}
      type={type}
      onClick={(e) => onClick && onClick(e)}
    >
      {icon}
    </button>
  )
}
