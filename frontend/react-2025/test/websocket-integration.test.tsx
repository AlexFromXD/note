import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DMProvider, useDMContext } from '../src/features/dm/contexts/DMContext'

// Mock ensureUserId
vi.mock('../src/lib/userIdentity', () => ({
  ensureUserId: () => 'test-user-123'
}))

// Mock the DM list hook
vi.mock('../src/features/dm/hooks/useDMList', () => ({
  useDMList: () => ({
    data: ['user1', 'user2'],
    refetch: vi.fn()
  })
}))



// Test component that uses the new DM context
function TestDMComponent() {
  const { conversations, getUnreadCount } = useDMContext()
  
  return (
    <div>
      <div data-testid="conversations-count">{conversations.length}</div>
      <div data-testid="user1-unread">{getUnreadCount('user1')}</div>
    </div>
  )
}

describe('DM Context Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Clear console logs for cleaner test output
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  it('should render conversations from mock data', async () => {
    render(
      <MemoryRouter>
        <DMProvider>
          <TestDMComponent />
        </DMProvider>
      </MemoryRouter>
    )
    
    await waitFor(() => {
      const conversationsCount = screen.getByTestId('conversations-count')
      expect(conversationsCount.textContent).toBe('2') // user1, user2 from mock
    })
  })

  it('should initialize with zero unread messages', async () => {
    render(
      <MemoryRouter>
        <DMProvider>
          <TestDMComponent />
        </DMProvider>
      </MemoryRouter>
    )
    
    await waitFor(() => {
      const unreadCount = screen.getByTestId('user1-unread')
      expect(unreadCount.textContent).toBe('0') // Initially no unread messages
    })
  })
})
