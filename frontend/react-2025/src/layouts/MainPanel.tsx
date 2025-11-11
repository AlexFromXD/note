import type { Feature } from "../types"

type DefaultMainPanelProps = {
  feature?: Feature
}


export function MainPanel({feature}: DefaultMainPanelProps) {
  const message = "TODO: the main panel"
  return (
    <div className="flex h-full flex-col p-4 text-sm text-gray-500">
      {feature ? `${message} of ${feature}` : message}
    </div>
  )
}
