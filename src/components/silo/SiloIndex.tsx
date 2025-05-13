"use client";

import SiloCreateCta from "@/components/silo/SiloCreateCta";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { listenForByOwnerUid } from "@/lib/silo";
import { Silo } from "@/types/silo";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SiloIndex() {
  const [silos, setSilos] = useState<Silo[] | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const unsubscribe = listenForByOwnerUid(
      currentUser?.uid ?? "",
      (silos: Silo[]) => {
        setSilos(silos);
      }
    );
    return () => unsubscribe();
  }, [currentUser?.uid]);

  return (
    <div className="flex flex-col w-96">

      <h1 className="text-center font-bold text-lg">Jouw silos</h1>

      <ul>
        {silos && silos.length > 0 ? (
          silos.map((silo) => (
            <li
              key={silo.uid}
              className="border p-2 flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{silo.name}</p>
                {silo.description && <p className="italic">{silo.description}</p>}
              </div>
              <Link className="underline" href={`/silo/edit/${silo.uid}`}>
                Wijzig
              </Link>
            </li>
          ))
        ) : (
          silos && <EmptyState cta={<SiloCreateCta />} />
        )}
      </ul>

      <Link className="underline" href="/silo/create">
        Nieuwe silo aanmaken
      </Link>

    </div>
  );
}
