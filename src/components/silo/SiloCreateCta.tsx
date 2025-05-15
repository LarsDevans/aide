import Link from "next/link"

export default function SiloCreateCta() {
  return (
    <Link
      className="w-fit underline"
      href="/silo/create"
    >
      Maak je eerste silo aan
    </Link>
  )
}
