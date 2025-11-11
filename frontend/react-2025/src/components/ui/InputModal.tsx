import { useEffect, useRef, useState } from "react"

interface InputModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (value: string) => void
  title: string
  placeholder?: string
  confirmText?: string
  cancelText?: string
}

export function InputModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  placeholder = "",
  confirmText = "確認",
  cancelText = "取消"
}: InputModalProps) {
  const [value, setValue] = useState("")
  const [isComposing, setIsComposing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setValue("")
      // 延遲聚焦，確保 modal 完全顯示後再聚焦
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 如果正在輸入法編輯中，不要提交
    if (isComposing) return
    
    if (value.trim()) {
      onConfirm(value.trim())
      setValue("")
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Modal 內容 */}
      <div className="relative bg-[#2E3238] rounded-lg shadow-xl w-full max-w-md mx-4 border border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">
            {title}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              placeholder={placeholder}
              className="w-full px-3 py-2 bg-[#1a1d21] border border-gray-600 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#256F5D] focus:border-transparent"
            />
            
            <div className="flex gap-3 mt-6 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-md transition-colors"
              >
                {cancelText}
              </button>
              <button
                type="submit"
                disabled={!value.trim()}
                className="px-4 py-2 text-sm font-medium bg-[#256F5D] text-white rounded-md hover:bg-[#2C8C76] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {confirmText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
