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

## interface

- Why implement interface implicitly ?

  - go is `structural typing` (duck typing at compile time) -> no runtime error

  - 在意 x 是否符合某個 interface 的`唯一`時機應該是使用 x 的時候 (而不是宣告的時候)

  - 一個 interfaces 不該有太多 methods (最好只有一個)，但一個 struct 可以同時滿足多個 interface

    > 在 interface 層滿足 SRP 就好，因為我們要 [Accept interfaces, return structs](./playground/interface-strcut/main.go)

  - implement interface explicitly 的情況下比較容易訂出太大的 interface，或是修改 interface 為了滿足實作。

## Typing

- [`type declaration` is not inherit](./playground/typing/main.go)
