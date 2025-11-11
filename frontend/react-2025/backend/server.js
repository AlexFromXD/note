import cors from 'cors'
import express from 'express'
import { WebSocketServer } from 'ws'
import { dmRouter } from './api.js'
import { checkUserId } from './middleware.js'
import { storage } from './storage.js'

const app = express()

app
  .use(
    cors({
      origin: 'http://localhost:5175',
      credentials: true,
    }),
  )
  .use(express.json())
  .use(checkUserId)
  .use(dmRouter)

const server = app.listen(3000, () => console.log('HTTP on 3000'))
const wss = new WebSocketServer({ server })

// type userId = string
// login => {"type":"login","userId": userId}
// chat => {"type":"message", "to": userId, "text": string}

wss.on('connection', (ws) => {
  let userId = null

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw)

      // --- 登入階段 ---
      if (msg.type === 'login') {
        userId = msg.userId
        storage.addSession(userId, ws)
        console.log(`✅ ${userId} connected`)
        ws.send(JSON.stringify({ type: 'system', text: 'login success' }))
        return
      }

      // --- 傳送訊息 ---
      if (msg.type === 'message') {
        const { to, text } = msg

        if (!to || !text?.trim()) {
          ws.send(
            JSON.stringify({ type: 'error', text: 'Invalid message format' }),
          )
          return
        }

        // 保存消息到存儲
        const savedMessage = storage.addMessage(userId, to, text)

        // 自動將雙方添加到彼此的聊天列表
        const senderIsNew = storage.addConversation(userId, to) // A 的列表加入 B
        const receiverIsNew = storage.addConversation(to, userId) // B 的列表加入 A

        console.log(
          `📝 Conversation added: ${userId} -> ${to} (new: ${senderIsNew})`,
        )
        console.log(
          `📝 Conversation added: ${to} -> ${userId} (new: ${receiverIsNew})`,
        )

        // 發送消息給接收者的所有連接
        const sent = storage.sendToUser(to, {
          from: userId,
          text,
          timestamp: savedMessage.timestamp,
        })

        if (sent) {
          // 只在有新對話時才通知更新聊天列表
          if (receiverIsNew) {
            storage.sendToUser(to, {
              type: 'conversation_updated',
              userId: userId,
            })
          }
        } else {
          // 即使對方不在線，也保存聊天關係
          ws.send(
            JSON.stringify({
              type: 'info',
              text: `Message sent to ${to} (offline)`,
            }),
          )
        }

        // 如果發送方有新對話，也通知發送方更新列表
        if (senderIsNew) {
          ws.send(
            JSON.stringify({
              type: 'conversation_updated',
              userId: to,
            }),
          )
        }

        console.log(`💬 ${userId} -> ${to}: ${text}`)
      }
    } catch (err) {
      ws.send(JSON.stringify({ type: 'error', text: 'invalid message' }))
    }
  })

  ws.on('close', () => {
    if (userId) {
      storage.removeSession(userId, ws)
      console.log(`❌ ${userId} disconnected`)
    }
  })
})
