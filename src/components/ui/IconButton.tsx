import { IconButton as IconButtonType } from "@/types/ui"

export default function IconButton({
  disabled = false,
  icon,
  type = "button",
  onClick
}: IconButtonType) {
  return (
    <button
      className="p-2 cursor-pointer disabled:cursor-not-allowed"
      disabled={disabled}
      type={type}
      onClick={(e) => onClick && onClick(e)}
    >
      {icon}
    </button>
  )
}
