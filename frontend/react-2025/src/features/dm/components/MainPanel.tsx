import { ensureUserId } from "@/lib/userIdentity"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { getMessages, type Message } from "../../../apis/dms"
import { useWebSocketConnection, useWebSocketSubscription } from "../../../hooks/useWebSocket"
import { useNewConversation } from "../hooks/useNewConversation"
import { NewConversationModal } from "./NewConversationModal"

export function DMMainPanel() {
  const { id: targetId } = useParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isComposing, setIsComposing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const userId = ensureUserId()
  const { sendMessage: wsSendMessage } = useWebSocketConnection()
  const { 
    isModalOpen, 
    openModal, 
    closeModal, 
    handleConfirm 
  } = useNewConversation()

  // 載入歷史消息和設置當前聊天用戶
  useEffect(() => {
    if (!targetId) return



    // 載入歷史消息
    const loadMessages = async () => {
      try {
        const messages = await getMessages(targetId)
        setMessages(messages)
        console.log(`Loaded ${messages.length} messages for chat with ${targetId}`)
      } catch (error) {
        console.error('Failed to load messages:', error)
        setMessages([]) // 載入失敗時清空消息列表
      }
    }
    
    loadMessages()

    return () => {
      
    }
  }, [targetId])

  // 訂閱 WebSocket 消息
  useWebSocketSubscription((msg: any) => {
    if (!targetId) return
    
    console.log('MainPanel received message:', msg)
      
    if (msg.type === "system") {
      console.log('System message:', msg.text)
      return
    }
    
    if (msg.type === "error") {
      console.error('WebSocket error:', msg.text)
      return
    }
    
    // 普通聊天消息 - 只顯示來自當前對話對象的消息
    if (msg.from && msg.text && msg.from === targetId) {
      const message: Message = {
        from: msg.from,
        text: msg.text,
        timestamp: msg.timestamp || Date.now()
      }
      setMessages((prev) => [...prev, message])
    }
  }, [targetId])

  // 自動滾動到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 送出訊息
  const sendMessage = () => {
    const trimmedInput = input.trim()
    if (!trimmedInput || !targetId) return

    try {
      // 發送到 WebSocket
      wsSendMessage({
        type: "message",
        to: targetId,
        text: trimmedInput,
      })

      // 立即在本地顯示消息（樂觀更新）
      setMessages((prev) => [...prev, { from: userId, text: trimmedInput, timestamp: Date.now() }])
      setInput("")
      
      console.log('Message sent to:', targetId, 'content:', trimmedInput)
    } catch (error) {
      console.error('Failed to send message:', error)
      // 可以在這裡顯示發送失敗的通知
    }
  }

  // 處理 Enter 鍵發送
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault()
      sendMessage()
    }
  }

  // 沒有選擇對話時的畫面
  if (!targetId) {
    return (
      <>
        <div className="flex h-full flex-col items-center justify-center bg-[#1a1d21] text-gray-200">
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-xl font-semibold text-gray-300">開始新對話</h2>
            <p className="text-gray-500">選擇一個用戶開始聊天</p>
            <button
              onClick={openModal}
              className="mt-6 rounded-md bg-[#256F5D] px-6 py-3 text-sm font-medium hover:bg-[#2C8C76] transition-colors"
            >
              新增對話
            </button>
          </div>
        </div>

        {/* 新增對話 Modal */}
        <NewConversationModal 
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={handleConfirm}
        />
      </>
    )
  }

  // 有對話時的聊天視窗
  return (
    <div className="flex h-full flex-col bg-[#1a1d21] text-gray-200">
      {/* Header */}
      <div className="flex items-center border-b border-gray-800 px-4 py-3">
        <span className="font-semibold">@{targetId}</span>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.from === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                m.from === userId
                  ? "bg-[#256F5D] text-white"
                  : "bg-[#2E3238] text-gray-100"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {/* 用於自動滾動的錨點 */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-800 p-3">
        <div className="flex items-center gap-2">
          <input
            className="flex-1 rounded-md bg-[#2E3238] px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#256F5D]"
            placeholder={`Message @${targetId}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
          />
          <button
            onClick={sendMessage}
            className="rounded-md bg-[#256F5D] px-3 py-2 text-sm font-medium hover:bg-[#2C8C76]"
          >
            Send
          </button>
        </div>
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
