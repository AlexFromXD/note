import { DMProvider } from '../contexts/DMContext'

interface DMRouteWrapperProps {
  children: React.ReactNode
}

/**
 * DM 路由包裝器
 * 為所有 DM 相關路由提供 DMProvider context
 */
export function DMRouteWrapper({ children }: DMRouteWrapperProps) {
  return (
    <DMProvider>
      {children}
    </DMProvider>
  )
}
