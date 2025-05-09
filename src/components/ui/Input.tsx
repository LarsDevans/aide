import { Input as InputType } from "@/types/input";

export default function Input({
  name,
  placeholder,
  type,
  value = undefined,
  onChange,
}: InputType) {
  return (
    <input
      className="border"
      name={name}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={(e) => onChange(e)}
    />
  );
}
