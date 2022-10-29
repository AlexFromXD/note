## generic vs overload

> ##### 以下使用 typescript v4.4.4 測試

#### 一般的[overload](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads)寫法如下：

```ts
function overloadFn(arg: string): string;
function overloadFn(arg: number): string;
function overloadFn(arg: string | number): string | number {
  if (typeof arg === "string") {
    return "this is string arg";
  }
  if (typeof arg === "number") {
    return "this is number arg";
  }
  throw Error("invalid type");
}
```

#### 但其實也可以改用範型約束來做：

```ts
function genericFn<T extends string | number>(arg: T): string {
  return `this is ${typeof arg} arg`;
}
```

### Issue

- ##### 使用 [Parameters\<Type\>](https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype)的時候：

  ```ts
  type ParamOfOverloadFn = Parameters<typeof overloadFn>[0]; // number or string, depends on the last define of overloads
  type ParamOfGenericFn = Parameters<typeof genericFn>[0]; // string | number
  ```

  `ParamOfOverloadFn`會是最後一個 overload 的 type，`ParamOfGenericFn`則是反映 `T`的 type。

- ##### 實作 interface 的時候

  ```ts
  interface SomeInterface {
    overloadFn(arg: string): string;
    overloadFn(arg: number): string;
    overloadFn(arg: Error): string;

    genericFn<T extends string | number | Error>(arg: T): string;
  }

  class Implementation implements SomeInterface {
    overloadFn = overloadFn; // Property 'overloadFn' in type 'Implementation' is not assignable to the same property in base type 'SomeInterface'.
    genericFn = genericFn; // Property 'genericFn' in type 'Implementation' is not assignable to the same property in base type 'SomeInterface'.
  }
  ```

  在上面的例子，不管是`overloadFn` 或 `genericFn`都會因為沒有處理到`Error type`所以報錯(ts2416)。但如果用`genericFn`去實作`overloadFn`，則會等到呼叫到 function 的時候才報錯。

  ```ts
  class Implementation implements SomeInterface {
    overloadFn = genericFn; // no error
    genericFn = genericFn; // Property 'genericFn' in type 'Implementation' is not assignable to the same property in base type 'SomeInterface'.
  }

  new Implementation().overloadFn(Error("???")); // Argument of type 'Error' is not assignable to parameter of type 'string | number'. Type 'Error' is not assignable to type 'number'.ts(2345)
  ```
