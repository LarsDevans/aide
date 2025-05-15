import { Input as InputType } from "@/types/ui"

export default function Input({
  name,
  placeholder,
  type,
  value = undefined,
  onChange,
}: InputType) {
  return (
    <input
      className="border p-2 rounded w-full"
      name={name}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={(e) => onChange(e)}
    />
  )
}
