import '@testing-library/jest-dom'

// Mock WebSocket for tests
global.WebSocket = class MockWebSocket {
  static CONNECTING = 0
  static OPEN = 1
  static CLOSING = 2
  static CLOSED = 3

  readyState = MockWebSocket.OPEN

  constructor(public url: string) {
    setTimeout(() => this.onopen?.(new Event('open')), 0)
  }

  onopen: ((event: Event) => void) | null = null
  onmessage: ((event: MessageEvent) => void) | null = null
  onclose: ((event: CloseEvent) => void) | null = null
  onerror: ((event: Event) => void) | null = null

  addEventListener(type: string, listener: any) {
    if (type === 'open') this.onopen = listener
    if (type === 'message') this.onmessage = listener
    if (type === 'close') this.onclose = listener
    if (type === 'error') this.onerror = listener
  }

  removeEventListener() {}

  send(data: string) {
    console.log('MockWebSocket send:', data)
  }

  close() {
    this.readyState = MockWebSocket.CLOSED
    setTimeout(() => this.onclose?.(new CloseEvent('close')), 0)
  }
}

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_WS_URL: 'ws://localhost:8080',
    PROD: false,
    DEV: true,
  },
  writable: true,
})
