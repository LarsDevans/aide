import { FormEvent } from "react";

export interface Button {
  disabled: boolean;
  label: string;
  type: "submit";
  onClick?: (e: FormEvent<HTMLButtonElement>) => void;
}
