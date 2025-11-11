export function checkUserId(req, res, next) {
  const userId = req.headers['x-user-id']
  if (!userId) {
    return res.status(401).json({ error: 'unauthorized' })
  }
  req.userId = userId
  next()
}
