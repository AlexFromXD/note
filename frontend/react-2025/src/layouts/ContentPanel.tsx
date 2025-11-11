import type { Feature } from "../types"

type DefaultContentPanelProps = {
  feature?: Feature
}


export function ContentPanel({feature}: DefaultContentPanelProps) {
  const message = "TODO: the content panel"
  return (
    <div className="flex h-full flex-col p-4 text-sm text-gray-500">
      {feature ? `${message} of ${feature}` : message}
    </div>
  )
}
