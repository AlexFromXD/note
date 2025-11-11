import { Outlet } from 'react-router-dom'

interface BasicLayoutProps {
  sidebar?: React.ReactNode
}


// ┌─────────────────────────────────────┐
// │ [sidebar] │     [Outlet]            │
// │   252px   │                         │
// │           │                         │
// │           │                         │
// │           │                         │
// │           │                         │
// │           │                         │
// └─────────────────────────────────────┘
function BasicLayout({ sidebar }: BasicLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="h-screen w-[252px] flex-shrink-0 overflow-y-auto bg-gray-100">
        {sidebar}
      </aside>
      <main className="mt-4 mr-4 mb-4 ml-2 flex-1 overflow-y-auto rounded-2xl bg-white">
        {/* Outlet 是 nested route 當中用來顯示子路由內容的元件 */}
        <Outlet />
      </main>
    </div>
  )
}

export default BasicLayout
