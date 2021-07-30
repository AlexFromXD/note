## 越多約束 越少錯誤

在`TypeScript`中要如何約束`Function`的參數呢？以下用`String Type`的參數來示範幾種用法：

- ### String Literal

```ts
  type Name = 'Alex' | 'Abby' | 'Allen'

  function greet(name: Name) {
    console.log(`Hello ${name}!`)
  }
```

假設是個簡單的Function，傳入的參數也沒有**複用**的需求時，直接列舉是最簡單的。

那如果需要複用呢？例如說一個`global config`，我們可以用`enum` 或 `namespace`

- ### Enum

```ts
enum Name {
  Alex = 'Alex',
  Abby = 'Abby',
  Allen = 'Allen'
}

function greet(name: Name) {
  console.log(`Hello ${name}!`)
}
```

這邊要注意只有`string enum`才有約束效果，如果今天參數是數值型別，然後type放了一個`numeric enum`，實際上傳入任意`number`都不會被`tsc`抓出來

- ### Namespace

```ts
namespace Name {
  export const Alex = 'Alex'
  export const Abby = 'Abby'
  export const Allen = 'Allen'
  export type Type =
    | typeof Alex
    | typeof Abby
    | typeof Allen
}

function greet(name: Name.Type) {
  console.log(`Hello ${name}!`)
}
```

這種寫法就可以適用於`string`, `number`甚至其他型別，至於要不要用`namespace`包起來就視情況決定吧，當程式碼很大一包的時候，`namespace`可以有效解決命名衝突的問題。

- ### keyof + typeof + {object}

```ts
const moduleConfig = {
  moduleA: { /* config of module A */ },
  moduleB: { /* config of module B */ },
  moduleC: { /* config of module C */ },
} as const

async function factory(module: keyof typeof moduleConfig) {
  return new (await import(`./modules/${module}`))(moduleConfig[module])
}
```

假設在某些`template`的情境下，我們要使用的模組又有各自的參數，那就可以先定義一個`object`來管理每個模組跟參數的關係（這邊的`as const`等於加上`readonly`的效果），再用`keyof typeof`將object的key取出作為type使用，這樣寫也順便實現了**動態載入**的效果。

> 注意事項：如果真的要這樣寫記得檢查你import進來的東西長怎樣。

---

### 補充 1

作為一個名字裡有**type**的語言，`TypeScript`真的提供了各種神奇寫法，好處是可以寫出強大的約束，缺點就是要玩到精通真的很花時間。改天有心情再來寫`generic`跟`overload`的用法。

### 補充 2

這篇的題目叫`如何幫參數加上嚴格的約束(string篇)`，雖然中文都講參數，實際上應該有`參數(parameters)` 跟`引數(arguments)`兩種東西。根據[wiki](https://en.wikipedia.org/wiki/Parameter_%28computer_programming%29#Parameters_and_arguments)的解釋:
> The term parameter (sometimes called formal parameter) is often used to refer to the variable as found in the function definition, while argument (sometimes called actual parameter) refers to the actual input supplied at function call.

```js
// formal parameter
function fn(param) {
  ...
}

// actual parameter
const arg = 'arg'
fn(arg)
```

既然type是寫在定義function的時候，所以應該叫做`parameter-constraint`而不是`argument-constraint`沒錯吧？
