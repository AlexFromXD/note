import { Search } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from "react-router-dom"
import { useMessageNotification } from "../contexts/MessageNotificationContext"
import { useWebSocket } from "../contexts/WebSocketContext"
import { useDMList } from "../hooks/useDMList"
import { useNewConversation } from "../hooks/useNewConversation"
import { NewConversationModal } from "./NewConversationModal"

export function DMContentPanel() {
  const navigate = useNavigate()
  const params = useParams()
  const { data: dms, isLoading, isError, refetch } = useDMList()
  const { t } = useTranslation()
  const { hasUnread, getUnreadCount, addUnreadMessage } = useMessageNotification()
  const { onMessage } = useWebSocket()
  const [flashingUsers, setFlashingUsers] = useState<Set<string>>(new Set())
  const addUnreadMessageRef = useRef(addUnreadMessage)
  const { 
    isModalOpen, 
    openModal, 
    closeModal, 
    handleConfirm
  } = useNewConversation()

  // 保持 addUnreadMessage ref 最新
  useEffect(() => {
    addUnreadMessageRef.current = addUnreadMessage
  }, [addUnreadMessage])

  // 訂閱全局 WebSocket 消息
  useEffect(() => {
    const unsubscribe = onMessage((msg) => {
      console.log('ContentPanel received message:', msg, 'current params.id:', params.id)
      
      // 當收到聊天列表需要更新的通知時
      if (msg.type === "conversation_updated") {
        console.log('Conversation list updated, refreshing...')
        refetch() // 重新獲取聊天列表
      }

      // 當收到聊天消息時，如果不是當前聊天窗口，觸發閃爍效果
      if (msg.from && msg.text) {
        const isCurrentChat = params.id === msg.from
        console.log(`📨 Message from ${msg.from}, current chat: ${params.id}, isCurrentChat: ${isCurrentChat}`)
        
        if (!isCurrentChat) {
          console.log(`🔔 New message from ${msg.from}, triggering flash effect`)
          
          // 使用 ref 來避免依賴問題
          addUnreadMessageRef.current(msg.from, msg.text)
          
          // 添加到閃爍用戶列表
          setFlashingUsers(prev => {
            const newSet = new Set([...prev, msg.from!])
            console.log('Updated flashing users:', Array.from(newSet))
            return newSet
          })
          
          // 2秒後移除閃爍效果
          setTimeout(() => {
            setFlashingUsers(prev => {
              const newSet = new Set(prev)
              newSet.delete(msg.from!)
              console.log('Removed flash effect for:', msg.from, 'remaining:', Array.from(newSet))
              return newSet
            })
          }, 2000)
        }
      }
    })

    return unsubscribe
  }, [params.id, refetch, onMessage])

  return (
    <div className="flex h-full w-full flex-col bg-[#222529] text-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 text-sm font-semibold">
        <span>Direct messages</span>
      <button
        onClick={openModal}
        className="rounded-md px-2 py-1 text-gray-400 hover:bg-[#2E3238] hover:text-white"
      >
        +
      </button>
      </div>

      {/* Search box */}
      <div className="relative mx-3 mb-3">
        <Search size={14} className="absolute left-2 top-2 text-gray-400" />
        <input
          type="text"
          placeholder="Find a DM"
          className="w-full rounded-md bg-[#2E3238] py-1 pl-7 pr-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#256F5D]"
        />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>}
        {isError && <div className="px-4 py-2 text-sm text-red-500">Failed to load</div>}

        {dms && dms.length > 0 ? (
          <div className="flex-1 overflow-y-auto">
          {dms?.map((dm, index) => {
            const unreadCount = getUnreadCount(dm)
            const isUnread = hasUnread(dm)
            const isFlashing = flashingUsers.has(dm)
            
            return (
              <button
                key={index}
                onClick={() => navigate(`/dm/${dm}`)}
                className={`relative flex w-full items-center gap-2 px-4 py-2 text-sm transition-all duration-300 ${
                  params.id === dm
                    ? "bg-[#256F5D] text-white"
                    : "text-gray-300 hover:bg-[#2E3238] hover:text-white"
                } ${isFlashing ? "animate-pulse bg-yellow-500/20" : ""}`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#256F5D] text-xs relative">
                  📨 
                  {/* 未讀消息小紅點 */}
                  {isUnread && (
                    <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-start text-left min-w-0 flex-1">
                  <span className={`font-medium truncate w-full ${
                    isUnread ? "text-white font-bold" : "text-gray-200"
                  }`}>
                    {/* User */}
                    {dm}
                  </span>
                  {/* <span className="text-xs text-gray-400 font-mono truncate w-full">  */}
                    {/* {dm} */}
                  {/* </span> */}
                </div>
              </button>
            )
          })}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-500 text-sm">
            {t("no_conversation")}
          </div>
        )}
      </div>

      {/* 新增對話 Modal */}
      <NewConversationModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
      />
    </div>
  )
}
