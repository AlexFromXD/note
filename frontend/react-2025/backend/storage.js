class Storage {
  /**
   * a Map to record {[userId]: Set<WebSocket>} - 支持每個用戶多個連接
   */
  _clientSessions = new Map()

  /**
   * a Map to record {[userId]: Set<userId>}
   */
  _conversations = new Map()

  /**
   * a Map to record messages between users
   * Structure: Map<conversationId, Array<{from, text, timestamp}>>
   * conversationId = 較小的userId + '-' + 較大的userId
   */
  _messages = new Map()

  addSession(userId, ws) {
    if (!this._clientSessions.has(userId)) {
      this._clientSessions.set(userId, new Set())
    }
    this._clientSessions.get(userId).add(ws)
    console.log(
      `📱 Added session for ${userId}, total: ${this._clientSessions.get(userId).size}`,
    )
  }

  getSessions(userId) {
    return this._clientSessions.get(userId) || new Set()
  }

  removeSession(userId, ws) {
    const sessions = this._clientSessions.get(userId)
    if (sessions) {
      sessions.delete(ws)
      if (sessions.size === 0) {
        this._clientSessions.delete(userId)
        console.log(`🚪 Removed all sessions for ${userId}`)
      } else {
        console.log(
          `📱 Removed session for ${userId}, remaining: ${sessions.size}`,
        )
      }
    }
  }

  // 向用戶的所有連接發送消息
  sendToUser(userId, message) {
    const sessions = this.getSessions(userId)
    let sentCount = 0

    sessions.forEach((ws) => {
      if (ws.readyState === ws.OPEN) {
        ws.send(typeof message === 'string' ? message : JSON.stringify(message))
        sentCount++
      }
    })

    console.log(`📤 Sent message to ${sentCount} sessions of user ${userId}`)
    return sentCount > 0
  }

  addConversation(userId, toUserId) {
    // 避免自己對自己的對話
    if (userId === toUserId) return false

    if (!this._conversations.has(userId)) {
      this._conversations.set(userId, new Set())
    }

    const conversations = this._conversations.get(userId)
    const wasNew = !conversations.has(toUserId)
    conversations.add(toUserId)

    return wasNew // 返回是否是新的對話
  }

  getConversations(userId) {
    return this._conversations.get(userId) || new Set()
  }

  // 生成對話 ID，確保兩個用戶之間的對話 ID 是一致的
  _getConversationId(userId1, userId2) {
    return userId1 < userId2 ? `${userId1}-${userId2}` : `${userId2}-${userId1}`
  }

  // 添加消息到對話
  addMessage(from, to, text) {
    const conversationId = this._getConversationId(from, to)

    if (!this._messages.has(conversationId)) {
      this._messages.set(conversationId, [])
    }

    const message = {
      from,
      text,
      timestamp: Date.now(),
    }

    this._messages.get(conversationId).push(message)
    console.log(`💬 Message saved: ${conversationId} - ${from}: ${text}`)

    return message
  }

  // 獲取對話的所有消息
  getMessages(userId1, userId2) {
    const conversationId = this._getConversationId(userId1, userId2)
    return this._messages.get(conversationId) || []
  }
}

const storage = new Storage()
export { storage }
