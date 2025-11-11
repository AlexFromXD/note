import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useWebSocketSubscription } from '../../../hooks/useWebSocket'
import { useDMList } from '../hooks/useDMList'

interface DMMessage {
  from: string
  text: string
  timestamp: number
  id?: string
}

interface DMContextType {
  // 狀態
  conversations: string[]
  messages: Map<string, DMMessage[]>
  unreadCounts: Map<string, number>
  flashingUsers: Set<string>
  currentChatUser: string | null
  
  // 操作
  markAsRead: (userId: string) => void
  clearFlash: (userId: string) => void
  setCurrentChatUser: (userId: string | null) => void
  
  // 查詢
  getUnreadCount: (userId: string) => number
  hasUnread: (userId: string) => boolean
  isFlashing: (userId: string) => boolean
}

const DMContext = createContext<DMContextType | null>(null)

interface DMProviderProps {
  children: React.ReactNode
}

export function DMProvider({ children }: DMProviderProps) {
  // 基礎狀態
  const [messages, setMessages] = useState<Map<string, DMMessage[]>>(new Map())
  const [unreadCounts, setUnreadCounts] = useState<Map<string, number>>(new Map())
  const [flashingUsers, setFlashingUsers] = useState<Set<string>>(new Set())
  const [currentChatUser, setCurrentChatUser] = useState<string | null>(null)
  
  // 對話列表來自 API
  const { data: conversations = [], refetch } = useDMList()
  
  // 監聽路由變化來更新當前聊天用戶
  const location = useLocation()
  useEffect(() => {
    const match = location.pathname.match(/^\/dm\/(.+)$/)
    if (match) {
      setCurrentChatUser(match[1])
    } else {
      setCurrentChatUser(null)
    }
  }, [location])
  
  // 統一的訊息處理邏輯
  const handleNewMessage = useCallback((message: any) => {
    if (message.from && message.text) {
      console.log('📨 Processing new message:', { from: message.from, text: message.text })
      
      const newMessage: DMMessage = {
        from: message.from,
        text: message.text,
        timestamp: message.timestamp || Date.now(),
        id: message.id || `${message.from}-${Date.now()}`
      }
      
      // 1. 添加訊息到對話
      setMessages(prev => {
        const newMap = new Map(prev)
        const userMessages = newMap.get(message.from) || []
        userMessages.push(newMessage)
        newMap.set(message.from, userMessages)
        return newMap
      })
      
      // 2. 檢查是否為新對話，如果是則重新獲取對話列表
      if (!conversations.includes(message.from)) {
        console.log('🔄 New conversation detected, refreshing list')
        refetch()
      }
      
      // 3. 更新未讀計數 (只有當訊息不是來自當前聊天用戶時)
      if (message.from !== currentChatUser) {
        setUnreadCounts(prev => {
          const newMap = new Map(prev)
          const currentCount = newMap.get(message.from) || 0
          newMap.set(message.from, currentCount + 1)
          return newMap
        })
      }
      
      // 4. 觸發閃爍效果
      setFlashingUsers(prev => new Set([...prev, message.from]))
      
      // 5. 2秒後移除閃爍效果
      setTimeout(() => {
        setFlashingUsers(prev => {
          const newSet = new Set(prev)
          newSet.delete(message.from)
          return newSet
        })
      }, 2000)
    }
  }, [conversations, refetch, currentChatUser])
  
  // WebSocket 訊息訂閱
  useWebSocketSubscription(handleNewMessage)
  
  // 操作函數
  const markAsRead = useCallback((userId: string) => {
    setUnreadCounts(prev => {
      const newMap = new Map(prev)
      newMap.set(userId, 0)
      return newMap
    })
  }, [])
  
  const clearFlash = useCallback((userId: string) => {
    setFlashingUsers(prev => {
      const newSet = new Set(prev)
      newSet.delete(userId)
      return newSet
    })
  }, [])
  
  // 查詢函數
  const getUnreadCount = useCallback((userId: string) => {
    return unreadCounts.get(userId) || 0
  }, [unreadCounts])
  
  const hasUnread = useCallback((userId: string) => {
    return (unreadCounts.get(userId) || 0) > 0
  }, [unreadCounts])
  
  const isFlashing = useCallback((userId: string) => {
    return flashingUsers.has(userId)
  }, [flashingUsers])
  
  const value: DMContextType = {
    // 狀態
    conversations,
    messages,
    unreadCounts,
    flashingUsers,
    currentChatUser,
    
    // 操作
    markAsRead,
    clearFlash,
    setCurrentChatUser,
    
    // 查詢
    getUnreadCount,
    hasUnread,
    isFlashing,
  }
  
  return (
    <DMContext.Provider value={value}>
      {children}
    </DMContext.Provider>
  )
}

export function useDMContext() {
  const context = useContext(DMContext)
  if (!context) {
    throw new Error('useDMContext must be used within a DMProvider')
  }
  return context
}
