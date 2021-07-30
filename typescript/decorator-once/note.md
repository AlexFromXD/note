## 前情提要

有時候會希望某些[非幂等](https://developer.mozilla.org/zh-CN/docs/Glossary/Idempotent)的function只能被呼叫一次。以前的寫法大概就是在function結束前複寫他，例如：

```js
class User {
  login() {
    ...
    this.login = () => {
      throw Error('execute login twice is not allowed')
    }
  }
}
```

但是自從開始用[nest](https://github.com/nestjs/nest)跟[typeorm](https://github.com/typeorm/typeorm)之後，project裡多了大量的`decorator`，想說用了這麼久好像也該自己寫個來試試。

---

## 正文

```ts
export function Once() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    let fn = descriptor.value
    descriptor.value = function (...arg: unknown[]) {
      const ret = fn.call(this, ...arg)
      fn = () => {
        throw Error(
          `execute ${this.constructor.name}.${propertyKey} twice is not allowed`
        )
      }
      return ret
    }
  }
}

class User {
  @Once()
  login() {
    console.log('login!')
  }
}

const user = new User()
user.login() // login!
user.login() // Error: execute User.login twice is not allowed

```

#### ~~大功告成，就是這麼簡單~~

才怪！問題馬上就來了，沒道理1號登過就不讓別人登吧...

```ts
const user1 = new User()
user1.login() // login!

const user2 = new User()
user2.login() // // Error: execute User.login twice is not allowed
```

原因是我本來以為`decorator`是跟著`method`一起，獨立存活在各個`instance`之中，但其實：

1. `decorator`有點`static`的味道，即使沒有用到也會在一開始跑過，而且也就只會跑一次。

2. `descriptor.value`大概是`prototype.${fn}`的概念（根據user2受影響推測的），而不是`instance`內部的方法。

既然如此那只要針對`instance`操作就好了，關鍵在於這行：

``` js
fn.call(this, ...arg)
```

既然在`decorator`的`scope`裡拿得到`this`那就簡單了，使用萬能的[Reflect](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Reflect)吧。

```ts
export function Once() {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const fn = descriptor.value
    descriptor.value = function (...args: unknown[]) {
      const ret = fn.call(this, ...args)
      Reflect.set(this, propertyKey, () => {
        throw Error(
          `execute ${this.constructor.name}.${propertyKey} twice is not allowed`
        )
      })
      return ret
    }
  }
}

export class User {
  @Once()
  login() {
    console.log('login!')
  }
}

const user1 = new User()
user1.login() // login!

const user2 = new User()
user2.login() // login!

user1.login() // Error: execute User.login twice is not allowed

```

看起來結果不錯，如果不想拋出錯誤也可以加個參數來控制：

``` ts
export function Once({ error = true } = {}) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const fn = descriptor.value
    descriptor.value = function (...args: unknown[]) {
      const ret = fn.call(this, ...args)
      Reflect.set(this, propertyKey, () => {
        if (error) {
          throw Error(
            `execute ${this.constructor.name}.${propertyKey} twice is not allowed`
          )
        }
      })
      return ret
    }
  }
}

export class User {
  @Once({ error: false })
  login() {
    console.log('login!')
  }
}

const user1 = new User()
user1.login() // login!

const user2 = new User()
user2.login() // login!

user1.login() // `nothing happened`

```

#### 這次真的大功告成啦

---

## 心得

個人覺得`decorator`最大的好處應該就是讓code變得比較乾淨好讀吧，但是這種整理方式感覺有點像把東西全塞進櫃子裡，只求一個眼不見為淨（？）上上策還是能寫越少越好，追求[nocode](https://github.com/kelseyhightower/nocode)的境界XD。另外這次只用了`Method Decorator`，其他還有

- Class Decorator
- Property Decorator
- Parameter Decorator

以後有機會再來試試。
