import { ReactNode } from "react";

export default function EmptyState({ cta }: { cta: ReactNode }) {
  return (
    <div className="border text-center p-4">
      <p>Oeps, er lijkt geen data beschikbaar te zijn!</p>
      <div className="pt-4">
        {cta}
      </div>
    </div>
  );
}
