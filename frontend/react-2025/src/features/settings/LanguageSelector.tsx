import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'

interface LanguageSelectorProps {
  value: string
  onValueChange: (value: string) => void
}

function LanguageSelector({ value, onValueChange }: LanguageSelectorProps) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium">Language</label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="english">English</SelectItem>
          <SelectItem value="chinese">中文</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default LanguageSelector
