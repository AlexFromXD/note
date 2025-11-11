import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createDM } from "../../../apis/dms"
import { queryKeys } from "../../../lib/queryKey"
import { ensureUserId } from "../../../lib/userIdentity"

// 基礎的對話創建 hook
export function useCreateConversation() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const userId = ensureUserId()

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      await createDM(targetUserId)
      return { targetUserId } // 返回目標用戶ID用於導航
    },
    onSuccess: (data) => {
      // 樂觀更新：立即添加到緩存中
      queryClient.setQueryData(queryKeys.dms(userId), (oldData: string[] | undefined) => {
        if (!oldData) return [data.targetUserId]
        if (oldData.includes(data.targetUserId)) return oldData
        return [...oldData, data.targetUserId]
      })
      
      // 然後重新獲取以確保同步
      queryClient.invalidateQueries({ queryKey: queryKeys.dms(userId) })
      
      // 立即導航
      navigate(`/dm/${data.targetUserId}`)
    },
  })
}

// 帶 Modal 的新對話 hook
export function useNewConversation() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { mutate: createConversation, isPending } = useCreateConversation()

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleConfirm = (targetUserId: string) => {
    createConversation(targetUserId)
    closeModal()
  }

  return {
    isModalOpen,
    openModal,
    closeModal,
    handleConfirm,
    isPending,
  }
}
