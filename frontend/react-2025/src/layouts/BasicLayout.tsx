import { NavPanel } from "./NavPanel"

type BasicLayoutProps = { 
  contentPanel: React.ReactNode
  mainPanel: React.ReactNode
}

export function BasicLayout({ contentPanel, mainPanel }: BasicLayoutProps) {
  return (
    <div className="flex h-screen w-screen bg-[#1a1d21] text-gray-200">
      <aside className="w-[72px] flex-shrink-0 border-r border-gray-800 bg-[#1a1d21]">
        <NavPanel />
      </aside>

      <section className="w-[260px] flex-shrink-0 border-r border-gray-800 bg-[#222529]">
        {contentPanel ?? <div className="p-4 text-sm text-gray-500">todo: chat list</div>}
      </section>

      <main className="flex-1 bg-[#1a1d21]">
        {mainPanel ?? <div className="p-4 text-sm text-gray-500">todo: chat window</div>}
      </main>
    </div>
  )
}
