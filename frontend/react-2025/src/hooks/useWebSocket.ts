import { useEffect, useRef, useState } from 'react'
import { WebSocketManager } from '../lib/websocket'

/**
 * React Hook 用於 WebSocket 連線狀態
 * 只提供狀態，不管理連線本身
 */
export function useWebSocketConnection() {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const wsManager = WebSocketManager.getInstance()

    // 同步初始狀態
    setIsConnected(wsManager.getConnectionStatus())

    // 監聽連線狀態變化
    const unsubscribe = wsManager.onConnectionChange(setIsConnected)

    return unsubscribe
  }, [])

  return {
    isConnected,
    sendMessage: (message: any) => WebSocketManager.getInstance().send(message),
  }
}

/**
 * React Hook 用於訂閱 WebSocket 消息
 * 穩定的訂閱模式，不受 StrictMode 影響
 */
export function useWebSocketSubscription(
  handler: (message: any) => void,
  deps: React.DependencyList = [],
) {
  // 使用 ref 保持 handler 的穩定引用
  const handlerRef = useRef(handler)
  handlerRef.current = handler

  useEffect(() => {
    const wsManager = WebSocketManager.getInstance()

    // 包裝 handler 使其引用穩定
    const stableHandler = (message: any) => handlerRef.current(message)

    const unsubscribe = wsManager.subscribe(stableHandler)

    return unsubscribe
  }, []) // 空依賴！只執行一次
}
