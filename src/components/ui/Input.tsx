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
      className="w-full rounded border p-2"
      name={name}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={(e) => onChange(e)}
    />
  )
}
