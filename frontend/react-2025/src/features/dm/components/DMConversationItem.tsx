import { useNavigate, useParams } from 'react-router-dom'
import { useDMContext } from '../contexts/DMContext'

interface DMConversationItemProps {
  userId: string
}

export function DMConversationItem({ userId }: DMConversationItemProps) {
  const navigate = useNavigate()
  const params = useParams()
  const { getUnreadCount, hasUnread, isFlashing, markAsRead } = useDMContext()
  
  const unreadCount = getUnreadCount(userId)
  const isUnread = hasUnread(userId)
  const isActive = params.id === userId
  const shouldFlash = isFlashing(userId)
  
  const handleClick = () => {
    navigate(`/dm/${userId}`)
    // 點擊時標記為已讀
    if (isUnread) {
      markAsRead(userId)
    }
  }
  
  return (
    <button
      onClick={handleClick}
      className={`relative flex w-full items-center gap-2 px-4 py-2 text-sm transition-all duration-300 ${
        isActive
          ? "bg-[#256F5D] text-white"
          : "text-gray-300 hover:bg-[#2E3238] hover:text-white"
      } ${shouldFlash ? "animate-pulse bg-yellow-500/20" : ""}`}
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
          {userId}
        </span>
      </div>
    </button>
  )
}
