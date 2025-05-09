import { ChangeEvent } from "react";

export interface Input {
  name: string;
  placeholder: string;
  type: "text" | "email" | "password";
  value?: string | undefined;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
