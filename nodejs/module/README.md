安裝 private module 的方法：

假設在同一個 monorepo 裡，可以直接安裝指定路徑： [範例](./app/package.json)

```
npm install ${path}
```

裝完以後會看到：

```json
"dependencies": {
  "moduleName": "file:../module/path"
}
```

> 要確保這個路徑部署之後一樣存在 | [範例](./app/package.json)

或是從某個 git repo 安裝：

```json
dependencies: {
  "moduleName": "git+ssh://git@${host}/${account}/${repo}.git#${branch | tag}"
}
```

`module` 裡的 package.json 可以這樣寫（假設是 typescript）：

```json
{
  "name": "awesome",
  "version": "0.0.1",
  "description": "",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    // 產生 .d.ts
    "build": "tsc --declaration",
    // prepare 把 ts build 成 js
    "prepare": "npm run build",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "AlexFromXD",
  "license": "ISC",
  "dependencies": {
    "typescript": "^4.9.5"
  }
}
```

再搭配 `.npmignore` 移除用不到的 source code

```
src
tsconfig.json
```

`tsconfig.json` 的 `outdir` 要記得設：

```json
{
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```
