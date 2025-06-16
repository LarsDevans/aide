import CategoryViewEdit from "@/components/silo/category/views/Edit"

export default async function CategoryEditPage({
  params,
}: {
  params: Promise<{ uid: string; categoryUid: string }>
}) {
  const { uid, categoryUid } = await params
  return (
    <CategoryViewEdit
      siloUid={uid}
      categoryUid={categoryUid}
    />
  )
}
