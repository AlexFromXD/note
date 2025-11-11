import { createContext, useCallback, useContext, useState } from "react"

interface UnreadMessage {
  from: string
  text: string
  timestamp: number
}

interface MessageNotificationContextType {
  unreadMessages: Map<string, UnreadMessage[]>
  addUnreadMessage: (from: string, text: string) => void
  clearUnreadMessages: (userId: string) => void
  setCurrentChatUser: (userId: string | null) => void
  getUnreadCount: (userId: string) => number
  hasUnread: (userId: string) => boolean
}

const MessageNotificationContext = createContext<MessageNotificationContextType | null>(null)

interface MessageNotificationProviderProps {
  children: React.ReactNode
}

export function MessageNotificationProvider({ children }: MessageNotificationProviderProps) {
  const [unreadMessages, setUnreadMessages] = useState<Map<string, UnreadMessage[]>>(new Map())
  const [currentChatUser, setCurrentChatUser] = useState<string | null>(null)



  const addUnreadMessage = useCallback((from: string, text: string) => {
    // 只有當消息不是來自當前正在聊天的用戶時才添加到未讀列表
    if (from !== currentChatUser) {
      setUnreadMessages(prev => {
        const newMap = new Map(prev)
        const messages = newMap.get(from) || []
        messages.push({ from, text, timestamp: Date.now() })
        newMap.set(from, messages)
        return newMap
      })
    }
  }, [currentChatUser])

  const clearUnreadMessages = useCallback((userId: string) => {
    setUnreadMessages(prev => {
      const newMap = new Map(prev)
      newMap.delete(userId)
      return newMap
    })
  }, [])

  const getUnreadCount = useCallback((userId: string) => {
    return unreadMessages.get(userId)?.length || 0
  }, [unreadMessages])

  const hasUnread = useCallback((userId: string) => {
    return getUnreadCount(userId) > 0
  }, [getUnreadCount])

  const setCurrentChat = useCallback((userId: string | null) => {
    setCurrentChatUser(userId)
  }, [])

  return (
    <MessageNotificationContext.Provider
      value={{
        unreadMessages,
        addUnreadMessage,
        clearUnreadMessages,
        setCurrentChatUser: setCurrentChat,
        getUnreadCount,
        hasUnread,
      }}
    >
      {children}
    </MessageNotificationContext.Provider>
  )
}

export function useMessageNotification() {
  const context = useContext(MessageNotificationContext)
  if (!context) {
    throw new Error('useMessageNotification must be used within MessageNotificationProvider')
  }
  return context
}
