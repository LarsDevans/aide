"use client";

import SiloCreateCta from "@/components/silo/SiloCreateCta";
import EmptyState from "@/components/ui/EmptyState";
import LoadingState from "@/components/ui/LoadingState";
import { getAuthUserUid } from "@/lib/auth";
import { listenForByOwnerUid } from "@/lib/silo";
import { Silo } from "@/types/silo";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function SiloIndex() {
  const [silos, setSilos] = useState<Silo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authUserUid = getAuthUserUid() ?? "";
    const unsubscribe = listenForByOwnerUid(authUserUid, (silos: Silo[]) => {
      setSilos(silos);
    });
    setIsLoading(false);

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col w-96">
      <h1 className="text-center font-bold text-lg">Jouw silos</h1>
      {isLoading && <LoadingState />}
      <ul>
        {silos.length > 0 ? (
          silos.map((silo) => (
            <li key={silo.uid} className="border">
              <p className="font-bold">{silo.name}</p>
              {silo.description && <p className="italic">{silo.description}</p>}
            </li>
          ))
        ) : (
          !isLoading && <EmptyState cta={<SiloCreateCta />} />
        )}
      </ul>

      <Link className="underline" href="/silo/create">
        Nieuwe silo aanmaken
      </Link>
    </div>
  );
}
