const {
  createClient
} = require('redis')
const {
  promisify
} = require('util')

class HintV2 {
  client = createClient()
  hintKey = 'hint'
  queryLimit = 50

  set(key) {
    for (let i = 1; i <= key.length; i++) {
      this.client.zincrby(this.hintKey, 0, key.slice(0, i).toLowerCase())
    }
    // the hint
    this.client.zincrby(this.hintKey, 0, `${key.toLowerCase()}*`)
  }

  async get(key, limit = 0) {

    const zrank = promisify(this.client.zrank).bind(this.client)
    const zrange = promisify(this.client.zrange).bind(this.client)

    let index = await zrank(this.hintKey, key.toLowerCase())
    if (index === null) {
      throw Error(`${key} not in redis`)
    }

    const hintList = []
    while (hintList.length <= limit) {
      const list = await zrange(this.hintKey, index, index + this.queryLimit - 1)
      if (list.length === 0) {
        hintList.length = limit
        break
      }

      index += this.queryLimit
      hintList.push(...list.filter(x => x.startsWith(key) && x.endsWith('*')).map(x => x.slice(0, x.length - 1)))
    }

    console.log(hintList)
  }
}

module.exports = {
  HintV2
}