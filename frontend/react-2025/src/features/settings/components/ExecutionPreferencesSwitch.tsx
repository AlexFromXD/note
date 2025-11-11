import { Switch } from '@/components/ui/Switch'

interface ExecutionPreferencesSwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
}

function ExecutionPreferencesSwitch({
  checked,
  onCheckedChange,
  label,
}: ExecutionPreferencesSwitchProps) {
  return (
    <div className="flex items-center gap-3">
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
      <label className="flex-1 font-medium">{label}</label>
    </div>
  )
}

export default ExecutionPreferencesSwitch
