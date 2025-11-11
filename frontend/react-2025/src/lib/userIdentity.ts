const STORAGE_KEY = 'x-user-id'

export function getUserId(): string | null {
  return localStorage.getItem(STORAGE_KEY)
}

export function setUserId(id: string) {
  localStorage.setItem(STORAGE_KEY, id)
}

export function ensureUserId(): string {
  let id = getUserId()
  if (!id) {
    // 這裡可改成實際登入流程或 UUID
    id = crypto.randomUUID()
    setUserId(id)
  }
  return id
}

export function clearUserId() {
  localStorage.removeItem(STORAGE_KEY)
}
