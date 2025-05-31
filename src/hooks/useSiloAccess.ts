import { useRouter, useParams } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { getByUid } from "@/lib/silo/silo"
import { SiloContext } from "@/contexts/SiloProvider"

export const useSiloAccess = () => {
  const { setSiloUid } = useContext(SiloContext)
  const params = useParams()
  const router = useRouter()
  const siloUid = params?.uid as string
  const [loading, setLoading] = useState(true)
  const [exists, setExists] = useState<boolean | null>(null)

  useEffect(() => {
    const checkSilo = async () => {
      const siloObj = await getByUid(siloUid)
      setExists(!!siloObj)
      setLoading(false)
      if (!siloObj) {
        router.replace("/silo")
      } else {
        setSiloUid(siloUid)
      }
    }
    if (siloUid) checkSilo()
  }, [siloUid, router, setSiloUid])

  return { loading, exists }
}
