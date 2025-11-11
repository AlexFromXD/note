import { Router } from 'express'
import { storage } from './storage.js'

const dmRouter = Router()

dmRouter
  .get('/dms', (req, res) => {
    const conversations = storage.getConversations(req.userId)
    console.log(
      `📋 Getting conversations for ${req.userId}:`,
      Array.from(conversations),
    )
    res.json({ conversations: Array.from(conversations) })
  })
  .get('/dms/:targetId/messages', (req, res) => {
    const { targetId } = req.params
    const messages = storage.getMessages(req.userId, targetId)
    console.log(
      `📨 Getting messages between ${req.userId} and ${targetId}:`,
      messages.length,
      'messages',
    )
    res.json({ messages })
  })
  .post('/dms', (req, res) => {
    const { target } = req.body
    if (!target) {
      return res.status(400).json({ error: 'target is required' })
    }

    storage.addConversation(req.userId, target)
    res.status(201).json({ id: target })
  })

export { dmRouter }
