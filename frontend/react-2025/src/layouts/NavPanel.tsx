import { Bell, Check, Clock, Copy, FileText, Home, MessageSquare, Wrench } from "lucide-react"
import { useState } from "react"
import { NavLink } from "react-router-dom"
import { getUserId } from "../lib/userIdentity"

export function NavPanel() {
  const [copied, setCopied] = useState(false)
  const userId = getUserId()
  
  const items = [
    { to: "/home", icon: <Home size={20} />, label: "Home" },
    { to: "/dm", icon: <MessageSquare size={20} />, label: "DMs" },
    { to: "/activity", icon: <Bell size={20} />, label: "Activity" },
    { to: "/file", icon: <FileText size={20} />, label: "Files" },
    { to: "/later", icon: <Clock size={20} />, label: "Later" },
    { to: "/tool", icon: <Wrench size={20} />, label: "Tools" },
  ]

  const copyUserId = async () => {
    if (userId) {
      try {
        await navigator.clipboard.writeText(userId)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy user ID:', err)
      }
    }
  }

  return (
    <div className="flex h-full w-[72px] flex-col items-center justify-between bg-[#1E473E] py-4 text-gray-200">
      {/* 上半部：主選單 */}
      <div className="flex flex-col items-center gap-6">
        {items.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `group flex flex-col items-center text-xs opacity-80 hover:opacity-100 ${
                isActive ? "text-white" : "text-gray-300"
              }`
            }
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-md transition-all ${
                window.location.pathname.startsWith(item.to)
                  ? "bg-[#256F5D]"
                  : "hover:bg-[#215C4D]"
              }`}
            >
              {item.icon}
            </div>
            <span className="mt-1 text-[10px] leading-none">{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* 下半部：使用者頭像和 ID */}
      <div className="flex flex-col items-center gap-2">
        {/* 匿名頭像 */}
        <div className="h-8 w-8 rounded-full bg-[#256F5D] flex items-center justify-center text-white text-sm font-medium">
          👤
        </div>
        
        {/* 用戶 ID - Hover 顯示完整資訊 */}
        {userId && (
          <div className="relative group">
            {/* 預設顯示：只顯示後4位 */}
            <button
              onClick={copyUserId}
              className="flex items-center justify-center w-12 h-6 rounded text-[9px] text-gray-400 hover:text-gray-200 hover:bg-[#215C4D] transition-all font-mono"
            >
              {copied ? (
                <Check size={12} className="text-green-400" />
              ) : (
                `${userId.slice(0,8)}-...`
              )}
            </button>
            
            {/* Hover 時顯示的 Tooltip - 向右展開 */}
            <div className="absolute bottom-0 left-full ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
              <div className="bg-gray-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl border border-gray-600">
                <div className="text-gray-300 mb-1 text-[10px]">User ID</div>
                <div className="font-mono text-gray-100 text-xs mb-2 break-all max-w-[400px]">
                  {userId}
                </div>
                <div className="text-gray-400 text-[9px] flex items-center gap-1">
                  <Copy size={8} />
                  Click to copy
                </div>
                {/* 左側箭頭 */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full border-4 border-transparent border-r-gray-800"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
