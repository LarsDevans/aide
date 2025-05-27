import { Select as SelectType } from "@/types/ui"

export default function Select({
    name,
    options,
    value = undefined,
    onChange,
}: SelectType) {
    return (
        <select
            className="w-full rounded border p-2"
            name={name}
            value={value}
            onChange={(e) => onChange(e)}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                {option.label}
                </option>
            ))}
        </select>
    )
}