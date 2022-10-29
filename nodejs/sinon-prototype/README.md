## 前言

一直以來測試都是用 [mocha](https://mochajs.org/) + [sinon](https://sinonjs.org/)寫的，而最常用的 API 大概是[stub](https://sinonjs.org/releases/latest/stubs/)。以往通常都是用在 class method 或一般的 function，結果今天用在 property 上遇到意外的 Error...

---

在[stub source code](https://github.com/sinonjs/sinon/blob/master/lib/sinon/stub.js#L77)裡面有一段：

```js
if (isNonExistentProperty(object, property)) {
  throw new TypeError(
    `Cannot stub non-existent property ${valueToString(property)}`
  );
}
```

而`isNonExistentProperty`的內容如下：

```js
function isNonExistentProperty(object, property) {
  return Boolean(
    object && typeof property !== "undefined" && !(property in object)
  );
}
```

`in`這個 operator 的檢查範圍包含 object 自己的 property 加上繼承來的，也就是沿著 prototype 往上找得到的所有 property 。然而 es6 class 會把 property 直接放進 instance，只有 method 會放進 prototype，例如：

```ts
class C {
  prop = 1;
  fn() {}
}
```

如果用 typescript 把這段 code build 成 es5 的版本會變成：

```js
var C = /** @class */ (function () {
  function C() {
    this.prop = 1;
  }
  C.prototype.fn = function () {};
  return C;
})();
```

或是直接用`hasOwnProperty`檢查：

```ts
class C {
  prop = 1;
  fn() {}
}

console.log(C.prototype.hasOwnProperty("prop")); // false
console.log(C.prototype.hasOwnProperty("fn")); // true

const c = new C();
console.log(c.hasOwnProperty("prop")); // true
console.log(c.hasOwnProperty("fn")); // false
```

即使 property 的 value 是個 function 也一樣：

```ts
class C {
  prop = () => 1;
  fn() {}
}

console.log(C.prototype.hasOwnProperty("prop")); // false
console.log(C.prototype.hasOwnProperty("fn")); // true

const c = new C();
console.log(c.hasOwnProperty("prop")); // true
console.log(c.hasOwnProperty("fn")); // false
```

這也就是為什麼在 stub method 的時候都要加上 prototype：

```js
stub(C.prototype, "fn");
```

至於要 stub property 的話就只能先抓出 instance 了。

---

## 同場加映

- [該來理解 JavaScript 的原型鍊了](https://blog.techbridge.cc/2017/04/22/javascript-prototype/)

- [`in` vs `hasOwnProperty`](https://masteringjs.io/tutorials/fundamentals/hasownproperty)

- [mock vs stub vs spy](https://stackoverflow.com/questions/62675699/difference-between-fake-spy-stub-and-mock-of-sinon-library-sinon-fake-vs-spy)
