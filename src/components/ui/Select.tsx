import { Select as SelectType } from "@/types/ui"

export default function Select({
  name,
  options,
  value = undefined,
  onChange,
  width = "w-full",
  placeholder,
  allowClear = false,
}: SelectType) {
  return (
    <select
      className={`${width} rounded border p-2`}
      name={name}
      value={value}
      onChange={(e) => onChange(e)}
    >
      {placeholder && (
        <option
          disabled={!allowClear}
          value=""
        >
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  )
}
