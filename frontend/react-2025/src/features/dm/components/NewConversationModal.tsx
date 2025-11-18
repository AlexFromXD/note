import { InputModal } from "../../../components/ui/InputModal"

interface NewConversationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (targetUserId: string) => void
}

export function NewConversationModal({ isOpen, onClose, onConfirm }: NewConversationModalProps) {
  return (
    <InputModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="開始新對話"
      placeholder="請輸入用戶 ID"
      confirmText="開始對話"
      cancelText="取消"
    />
  )
}
