import { axiosInstance } from '@/apis/api-client'
import { z } from 'zod'

const dmSchema = z.object({
  conversations: z.array(z.string()),
})

const messageSchema = z.object({
  from: z.string(),
  text: z.string(),
  timestamp: z.number(),
})

const messagesResponseSchema = z.object({
  messages: z.array(messageSchema),
})

export async function getDMs() {
  // : Promise<z.infer<typeof dmSchema>['conversations']>
  // Seems like TypeScript can infer the return type automatically
  const res = await axiosInstance.get('/dms')

  const { conversations } = dmSchema.parse(res)
  return conversations
}

export async function createDM(target: string) {
  const res = await axiosInstance.post('/dms', { target })
  return res.data // e.g. { id: "new-conv-id" }
}

export async function getMessages(targetId: string) {
  const res = await axiosInstance.get(`/dms/${targetId}/messages`)
  const { messages } = messagesResponseSchema.parse(res)
  return messages
}

// 導出消息類型
export type Message = z.infer<typeof messageSchema>
