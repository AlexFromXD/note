import { Switch } from '@/components/ui/Switch'

interface ResponsePreferencesSwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
  onDescription: string
  offDescription: string
}

function ResponsePreferencesSwitch({
  checked,
  onCheckedChange,
  label,
  onDescription,
  offDescription,
}: ResponsePreferencesSwitchProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <Switch checked={checked} onCheckedChange={onCheckedChange} />
        <div className="flex-1">
          <label className="font-medium">{label}</label>
        </div>
      </div>
      <div className="text-muted-foreground ml-11 space-y-1 text-sm">
        <p>On: {onDescription}</p>
        <p>Off: {offDescription}</p>
      </div>
    </div>
  )
}

export default ResponsePreferencesSwitch
