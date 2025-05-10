import { ChangeEvent, FormEvent } from "react";

export interface Button {
  disabled: boolean;
  label: string;
  type: "submit";
  onClick?: (e: FormEvent<HTMLButtonElement>) => void;
}

export interface Input {
  name: string;
  placeholder: string;
  type: "text" | "email" | "password";
  value?: string | undefined;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
