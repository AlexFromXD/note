import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './globals.css'
import './i18n'
import { ensureUserId } from './lib/userIdentity'
import { WebSocketInitializer } from './lib/websocket'

// 在應用啟動前確保 userId 存在，避免 race condition
ensureUserId()

// 避免大量資料載入時的效能與使用者體驗問題
// https://tanstack.com/query/latest/docs/framework/react/overview
const queryClient = new QueryClient()


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* react-helmet-async 的使用情境主要集中在 SEO 與 meta 資訊管理，在 CSR 主要是 for
      - 單頁應用 (SPA) 的路由切換時更新標題與 meta
      - 實作國際化（i18n）時依語系改變 head 資訊 */}
      <HelmetProvider>
        <WebSocketInitializer />
        
        
          <App />
        
      </HelmetProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </StrictMode>,
)
