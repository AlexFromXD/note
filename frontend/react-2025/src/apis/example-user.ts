import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { axiosInstance } from './api-client.ts'

const PATH = '/auth/user-info'

const schema = z.object({
  user: z.object({
    email: z.string(),
    id: z.number(),
    name: z.string(),
  }),
})

const getUserInfo = async (headers?: Record<string, string | number>) => {
  const res = await axiosInstance.get(PATH, {
    headers: {
      ...headers,
    },
  })

  const { user } = schema.parse(res)

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  }
}

/**
 * Basic type in App
 */
export type User = Awaited<ReturnType<typeof getUserInfo>>

interface UserInfoProps {
  retry: boolean | number
}
const useUserInfo = ({ retry }: UserInfoProps = { retry: 3 }) =>
  useQuery({
    // primary key for caching 的概念，在 staleTime 到期前
    // 如果其他的 useQuery 用到相同的 key，就不會執行 queryFn
    // 建議格式為 ...path, Object(queryParams)
    // 假設 API 是 GET /conversations/1/message?id=1
    //  -> queryKey: ["conversations", 1, "message", {id: 1}]
    queryKey: [PATH],
    queryFn: () => {
      try {
        return getUserInfo()
      } catch (error) {
        console.error(error)
        return Promise.reject(error)
      }
    },
    retry,
  })

export { getUserInfo }
export default useUserInfo
