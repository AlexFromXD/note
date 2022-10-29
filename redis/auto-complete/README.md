## 來做個自動補齊的提示功能吧

### 方案 1

[程式碼連結](./hint-v1.js)

```js
class HintV1 {
  client = createClient();

  format(key) {
    // redis is case-sensitive
    return `hint:${key.toLowerCase()}`;
  }

  set(key) {
    for (let i = 1; i <= key.length; i++) {
      this.client.zincrby(this.format(key.slice(0, i)), 0, key);
    }
  }

  get(key, limit = 0) {
    this.client.zrange(this.format(key), 0, limit - 1, print);
  }
}
```

塞一些資料進去

```js
const h = new HintV1();
h.set("Abby");
h.set("Alex");
h.set("Alice");
h.set("Allen");
h.set("Amy");
```

結果長這樣

```
127.0.0.1:6379> keys hint:*
 1) "hint:all"
 2) "hint:ali"
 3) "hint:ale"
 4) "hint:alle"
 5) "hint:alex"
 6) "hint:alic"
 7) "hint:allen"
 8) "hint:al"
 9) "hint:alice"
10) "hint:a"
```

---

### 方案 2

[程式碼連結](./hint-v2.js)

```js
class HintV2 {
  client = createClient();
  hintKey = "hint";
  queryLimit = 50;

  set(key) {
    for (let i = 1; i <= key.length; i++) {
      this.client.zincrby(this.hintKey, 0, key.slice(0, i).toLowerCase());
    }
    // the hint
    this.client.zincrby(this.hintKey, 0, `${key.toLowerCase()}*`);
  }

  async get(key, limit = 0) {
    const zrank = promisify(this.client.zrank).bind(this.client);
    const zrange = promisify(this.client.zrange).bind(this.client);

    let index = await zrank(this.hintKey, key.toLowerCase());
    if (index === null) {
      throw Error(`${key} not in redis`);
    }

    const hintList = [];
    while (hintList.length <= limit) {
      const list = await zrange(
        this.hintKey,
        index,
        index + this.queryLimit - 1
      );
      if (list.length === 0) {
        hintList.length = limit;
        break;
      }

      index += this.queryLimit;
      hintList.push(
        ...list
          .filter((x) => x.startsWith(key) && x.endsWith("*"))
          .map((x) => x.slice(0, x.length - 1))
      );
    }

    console.log(hintList);
  }
}
```

塞一些資料進去

```js
const h = new HintV2();
h.set("Abby");
h.set("Alex");
h.set("Alice");
h.set("Allen");
h.set("Amy");
```

結果長這樣

```
127.0.0.1:6379> zrange hint 0 -1
 1) "a"
 2) "ab"
 3) "abb"
 4) "abby"
 5) "abby*"
 6) "al"
 7) "ale"
 8) "alex"
 9) "alex*"
10) "ali"
11) "alic"
12) "alice"
13) "alice*"
14) "all"
15) "alle"
16) "allen"
17) "allen*"
18) "am"
19) "amy"
20) "amy*"
```

---

## 結語

兩種作法的結果基本上是一樣的，但如果用`MEMORY USAGE key`來檢查的話，會發現第一種作法因為使用了多個 sorted set，總共需要 1172 byte，而第二種作法僅使用了 213 byte。缺點則是實作的邏輯稍微複雜一點，需要先用`zrank`找到 index，再用迴圈去找出每個 hint。

備註：範例中使用的套件[redis](https://www.npmjs.com/package/redis)只有提供 callback api，實際開發時可以選擇[ioredis](https://www.npmjs.com/package/ioredis)或其他替代方案。另外也需要記得處理各種例外狀況及異步問題，祝大家開發愉快。
