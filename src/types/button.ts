import { FormEvent } from "react";

export interface Button {
  label: string;
  type: "submit";
  onClick?: (e: FormEvent<HTMLButtonElement>) => void;
}
