const {
  createClient,
  print
} = require('redis')

class HintV1 {
  client = createClient()

  format(key) {
    // redis is case-sensitive
    return `hint:${key.toLowerCase()}`
  }

  set(key) {
    for (let i = 1; i <= key.length; i++) {
      this.client.zincrby(this.format(key.slice(0, i)), 0, key)
    }
  }

  get(key, limit = 0) {
    this.client.zrange(this.format(key), 0, limit - 1, print)
  }
}

module.exports = {
  HintV1
}