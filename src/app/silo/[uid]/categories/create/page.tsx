import CategoryViewCreate from "@/components/silo/categories/views/Create"

export default async function CategoryCreatePage({
  params,
}: {
  params: Promise<{ uid: string }>
}) {
  const { uid } = await params
  return <CategoryViewCreate siloUid={uid} />
}
