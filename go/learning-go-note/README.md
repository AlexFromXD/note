## 前言

以下內容為參考 [Go 學習手冊](https://www.tenlong.com.tw/products/9789865028787) CH.5 - CH.7 的摘要

## func

- 函式參數不支援 `named` & `optional` (e.g. python)，因為參數不應該太多。

  > https://refactoring.guru/smells/long-parameter-list

  ```python
  def fn(a=1, b=2, c):
    print(a, b, c)

  fn(b=2, a=1)
  ```

- 函式支援不定長度參數，[type 是 slice](./playground/slice-parameter/main.go)

- 函式應該要 [Accept interfaces, return structs](./playground/interface-strcut/main.go)

- 使用具名回傳時，不要直接 return

  👍

  ```go
  func fn() (e error) {
    return e
  }
  ```

  👎

  ```go
  func fn() (e error) {
    return
  }
  ```

- func signature: 定義 function 的 input / output，name is optional

  ```go
  func (int ,string) (int, bool)
  ```

- function type: 把 signature 宣告成 type。 [Function Types are Bridge to Interfaces](./playground/bridge/main.go)

- closure: 在函式中宣告函式，在內層函式操作宣告在外層函式的變數。
