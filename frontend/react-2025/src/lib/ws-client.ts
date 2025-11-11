import { ensureUserId } from '@/lib/userIdentity'

export function createWS(baseUrl: string): WebSocket {
  const userId = ensureUserId()
  const ws = new WebSocket(baseUrl)

  ws.addEventListener('open', () => {
    ws.send(JSON.stringify({ type: 'login', userId }))
  })

  return ws
}
