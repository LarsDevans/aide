import CategoryViewCreate from "@/components/silo/category/views/Create"

export default async function CategoryCreatePage({
  params,
}: {
  params: Promise<{ uid: string }>
}) {
  const { uid } = await params
  return <CategoryViewCreate siloUid={uid} />
}
