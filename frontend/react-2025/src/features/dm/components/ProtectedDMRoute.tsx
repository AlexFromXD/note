import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { BasicLayout } from "../../../layouts/BasicLayout"
import { useDMList } from "../hooks/useDMList"
import { DMContentPanel } from "./ContentPanel"
import { DMMainPanel } from "./MainPanel"

export function ProtectedDMRoute() {
  const { id: targetId } = useParams()
  const { data: dms, isLoading, isError } = useDMList()
  const navigate = useNavigate()

  useEffect(() => {
    // 等待數據加載完成
    if (isLoading) return

    // 如果加載失敗，重定向到 /dm
    if (isError) {
      navigate("/dm", { replace: true })
      return
    }

    // 如果有 targetId 但不在聊天列表中，重定向到 /dm
    if (targetId && dms) {
      const dmExists = Array.from(dms).includes(targetId)
      if (!dmExists) {
        console.log(`Chat room ${targetId} not found in user's chat list, redirecting to /dm`)
        // 可以顯示一個 toast 通知用戶
        navigate("/dm", { 
          replace: true,
          state: { 
            message: `Chat with ${targetId} not found`,
            type: 'warning'
          }
        })
        return
      }
    }
  }, [targetId, dms, isLoading, isError, navigate])

  // 加載中時顯示加載狀態
  if (isLoading) {
    return (
      <BasicLayout
        contentPanel={<DMContentPanel />}
        mainPanel={
          <div className="flex h-full flex-col items-center justify-center bg-[#1a1d21] text-gray-200">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#256F5D] mx-auto"></div>
              <p className="text-gray-500">Verifying chat access...</p>
              {targetId && (
                <p className="text-xs text-gray-600 font-mono">
                  Checking: {targetId}
                </p>
              )}
            </div>
          </div>
        }
      />
    )
  }

  // 正常渲染 DM 界面
  return (
    <BasicLayout
      contentPanel={<DMContentPanel />}
      mainPanel={<DMMainPanel />}
    />
  )
}
