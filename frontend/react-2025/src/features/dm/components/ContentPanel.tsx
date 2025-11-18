import { Search } from "lucide-react"
import { useTranslation } from 'react-i18next'
import { useDMContext } from "../contexts/DMContext"
import { useNewConversation } from "../hooks/useNewConversation"
import { DMConversationItem } from "./DMConversationItem"
import { NewConversationModal } from "./NewConversationModal"

export function DMContentPanel() {
  const { t } = useTranslation()
  const { conversations } = useDMContext()
  const { 
    isModalOpen, 
    openModal, 
    closeModal, 
    handleConfirm
  } = useNewConversation()

  return (
    <div className="flex h-full w-full flex-col bg-[#222529] text-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 text-sm font-semibold">
        <span>Direct messages</span>
      <button
        onClick={openModal}
        className="rounded-md px-2 py-1 text-gray-400 hover:bg-[#2E3238] hover:text-white"
      >
        +
      </button>
      </div>

      {/* Search box */}
      <div className="relative mx-3 mb-3">
        <Search size={14} className="absolute left-2 top-2 text-gray-400" />
        <input
          type="text"
          placeholder="Find a DM"
          className="w-full rounded-md bg-[#2E3238] py-1 pl-7 pr-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#256F5D]"
        />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {conversations && conversations.length > 0 ? (
          <div className="flex-1 overflow-y-auto">
            {conversations.map((userId) => (
              <DMConversationItem key={userId} userId={userId} />
            ))}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-500 text-sm">
            {t("no_conversation")}
          </div>
        )}
      </div>

      {/* 新增對話 Modal */}
      <NewConversationModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
      />
    </div>
  )
}
