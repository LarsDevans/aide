import { Input as InputType } from "@/types/ui"

export default function Input({
  name,
  placeholder,
  type,
  value = undefined,
  onChange,
  step = "1",
}: InputType) {
  return (
    <input
      className="w-full rounded border p-2"
      name={name}
      placeholder={placeholder}
      type={type}
      value={value}
      step={step}
      onChange={(e) => onChange(e)}
    />
  )
}
