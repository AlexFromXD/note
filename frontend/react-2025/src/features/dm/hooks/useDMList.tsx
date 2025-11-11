import { getDMs } from "@/apis/dms"
import { ensureUserId } from "@/lib/userIdentity"
import { useQuery } from "@tanstack/react-query"

export function useDMList() {
  const userId = ensureUserId()
  return useQuery({
    queryKey: ["dms", userId],
    queryFn: getDMs,
    staleTime: 5_000, // 降低 staleTime，讓列表更容易更新
    refetchOnWindowFocus: true,
  })
}
