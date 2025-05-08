import { Button as ButtonType } from "@/types/button";

export default function Button({ label, type, onClick }: ButtonType) {
  return (
    <button
      className="border cursor-pointer"
      type={type}
      onClick={(e) => onClick && onClick(e)}
    >
      {label}
    </button>
  );
}
