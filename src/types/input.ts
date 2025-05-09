import { ChangeEvent } from "react";

export interface Input {
  name: string;
  placeholder: string;
  type: "email" | "password";
  value?: string | undefined;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
