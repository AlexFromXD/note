import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { ensureUserId } from "../../../lib/userIdentity"

interface WebSocketMessage {
  type?: string
  from?: string
  text?: string
  timestamp?: number
  userId?: string
}

interface WebSocketContextType {
  ws: WebSocket | null
  isConnected: boolean
  sendMessage: (message: any) => void
  // 事件訂閱
  onMessage: (callback: (message: WebSocketMessage) => void) => () => void
}

const WebSocketContext = createContext<WebSocketContextType | null>(null)

interface WebSocketProviderProps {
  children: React.ReactNode
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const messageCallbacksRef = useRef<Set<(message: WebSocketMessage) => void>>(new Set())

  useEffect(() => {
    const userId = ensureUserId()
    const ws = new WebSocket(import.meta.env.VITE_WS_URL)
    wsRef.current = ws

    ws.addEventListener('open', () => {
      console.log('🔌 Global WebSocket connected')
      ws.send(JSON.stringify({ type: 'login', userId }))
      setIsConnected(true)
    })

    ws.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data)
        console.log('🔔 Global WebSocket received:', message)
        
        // 分發消息給所有訂閱者
        messageCallbacksRef.current.forEach(callback => {
          callback(message)
        })
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    })

    ws.addEventListener('close', () => {
      console.log('🔌 Global WebSocket disconnected')
      setIsConnected(false)
    })

    ws.addEventListener('error', (error) => {
      console.error('🔌 Global WebSocket error:', error)
    })

    return () => {
      ws.close()
      wsRef.current = null
      setIsConnected(false)
    }
  }, [])

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    } else {
      console.error('WebSocket is not connected')
    }
  }, [])

  const onMessage = useCallback((callback: (message: WebSocketMessage) => void) => {
    messageCallbacksRef.current.add(callback)
    
    // 返回取消訂閱的函數
    return () => {
      messageCallbacksRef.current.delete(callback)
    }
  }, [])

  return (
    <WebSocketContext.Provider
      value={{
        ws: wsRef.current,
        isConnected,
        sendMessage,
        onMessage,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider')
  }
  return context
}
