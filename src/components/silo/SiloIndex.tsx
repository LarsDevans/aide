"use client";

import EmptyState from "@/components/ui/EmptyState";
import LoadingState from "@/components/ui/LoadingState";
import { getAll } from "@/lib/silo";
import { Silo } from "@/types/silo";
import { useEffect, useState } from "react";

export default function SiloIndex() {
  const [silos, setSilos] = useState<Silo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSilos = async () => {
      const data = await getAll();
      setIsLoading(false);
      setSilos(data);
    }

    fetchSilos();
  });

  return (
    <div className="flex flex-col w-96">
      <h1 className="text-center font-bold text-lg">Jouw silos</h1>
      <ul>
        {silos.length > 0 ? (
          silos.map((silo) => (
            <li key={silo.uid} className="border">
              <span className="font-bold">{silo.name}</span>
              {silo.description && <p className="italic">{silo.description}</p>}
            </li>
          ))
        ) : (
          !isLoading && <EmptyState />
        )}
      </ul>
      {isLoading && <LoadingState />}
    </div>
  );
}
