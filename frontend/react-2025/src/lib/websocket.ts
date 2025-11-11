/**
 * WebSocket 管理器 - 應用級單例服務
 * 不依賴 React 組件生命週期，避免 StrictMode 重複執行問題
 */

import { useEffect } from 'react'
import { ensureUserId } from './userIdentity'

interface WebSocketMessage {
  type?: string
  from?: string
  text?: string
  timestamp?: number
  userId?: string
  id?: string
}

type MessageHandler = (message: WebSocketMessage) => void

export class WebSocketManager {
  private static instance: WebSocketManager
  private ws: WebSocket | null = null
  private messageHandlers = new Set<MessageHandler>()
  private connectionCallbacks = new Set<(connected: boolean) => void>()
  private isConnected = false

  private constructor() {}

  static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager()
    }
    return WebSocketManager.instance
  }

  connect(wsUrl: string, userId: string) {
    // 防止重複連線
    if (
      this.ws?.readyState === WebSocket.OPEN ||
      this.ws?.readyState === WebSocket.CONNECTING
    ) {
      return
    }

    this.ws = new WebSocket(wsUrl)

    this.ws.addEventListener('open', () => {
      console.log('🔌 WebSocket connected')
      this.ws!.send(JSON.stringify({ type: 'login', userId }))
      this.isConnected = true
      this.connectionCallbacks.forEach((callback) => callback(true))
    })

    this.ws.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data)
        console.log('🔔 WebSocket received:', message)

        // 廣播給所有監聽者
        this.messageHandlers.forEach((handler) => {
          try {
            handler(message)
          } catch (error) {
            console.error('Message handler error:', error)
          }
        })
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    })

    this.ws.addEventListener('close', () => {
      console.log('🔌 WebSocket disconnected')
      this.isConnected = false
      this.connectionCallbacks.forEach((callback) => callback(false))
    })

    this.ws.addEventListener('error', (error) => {
      console.error('🔌 WebSocket error:', error)
    })
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
      this.isConnected = false
    }
  }

  send(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.error('WebSocket is not connected')
    }
  }

  // 訂閱消息
  subscribe(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler)
    return () => this.messageHandlers.delete(handler)
  }

  // 訂閱連線狀態
  onConnectionChange(callback: (connected: boolean) => void): () => void {
    this.connectionCallbacks.add(callback)
    return () => this.connectionCallbacks.delete(callback)
  }

  getConnectionStatus(): boolean {
    return this.isConnected
  }
}

/**
 * 應用級 WebSocket 初始化器
 * 只負責建立連線，不管理連線狀態
 */
export function WebSocketInitializer() {
  useEffect(() => {
    const userId = ensureUserId()
    const wsManager = WebSocketManager.getInstance()

    // 建立連線 (內建防重複連線邏輯)
    wsManager.connect(import.meta.env.VITE_WS_URL, userId)

    // 清理時不主動斷線，讓連線保持全域存在
    // return () => wsManager.disconnect()
  }, [])
}
