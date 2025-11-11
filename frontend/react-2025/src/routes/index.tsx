import BasicLayout from '@/layouts/BasicLayout'
import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

// ESM 的 import 本身也會回傳 Promise
// 不過 lazy 會偵測當元件要被渲染時 `throw Promise` https://www.reddit.com/r/reactjs/comments/1f8z0v0/suspense_why_throw_a_promise/
// 就能搭配 Suspense 顯示 fallback UI
const ChatPage = lazy(() => import('@/pages/Chat'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))

const router = createBrowserRouter([
  {
    // TODO: implement the sidebar
    element: <BasicLayout />,
    children: [
      {
        index: true, // index = "/", redirect from "/" to "/chat"
        element: <Navigate to="/chat" replace />,
      },
      {
        path: '/chat',
        element: (
          // Suspense: 等待 component 當中的 promise 都 resolve 之前，先顯示一個 fallback（例如 loading 畫面）
          <Suspense fallback={<div>Loading...</div>}>
            <ChatPage />
          </Suspense>
        ),
      },
      {
        path: '/settings',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <SettingsPage />
          </Suspense>
        ),
      },
    ],
  },
])

export default router
