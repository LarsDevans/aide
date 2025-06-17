import Link from "next/link"

export default function CategoryCtaCreate({ href }: { href: string }) {
  return (
    <Link
      className="w-fit underline"
      href={href}
    >
      Maak je eerste categorie aan
    </Link>
  )
}
